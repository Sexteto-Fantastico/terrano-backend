import { FindOptionsWhere, FindManyOptions, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { User } from "../infra/entities/user.entity";
import { UserQuery } from "../dtos/user.dto";

const userRepository = AppDataSource.getRepository(User);

async function createUser(user: User): Promise<User> {
  return await userRepository.save(user);
}

async function getUserByUsername(username: string): Promise<User | null> {
  return await userRepository.findOne({ where: { username }, withDeleted: true });
}

async function getUserByEmail(email: string): Promise<User | null> {
  return await userRepository.findOne({ where: { email }, withDeleted: true });
}

async function getUserByPasswordResetToken(
  token: string,
): Promise<User | null> {
  return await userRepository.findOne({
    where: { password_reset_token: token },
  });
}

async function getUserById(
  id: number,
  withDeleted: boolean = false,
): Promise<User | null> {
  return await userRepository.findOne({
    where: { id },
    withDeleted,
    relations: ["role", "department"],
  });
}

async function getAllUsers(filters: UserQuery = {}): Promise<[User[], number]> {
  const { activeOnly = true, pageIndex, pageSize, sortBy, sortOrder } = filters;

  const where: FindOptionsWhere<User> = {};

  if (filters.name) {
    where.name = ILike(`%${filters.name}%`);
  }
  if (filters.cpf) {
    where.cpf = filters.cpf;
  }
  if (filters.departmentId) {
    where.department = { id: filters.departmentId };
  }

  const options: FindManyOptions<User> = {
    where,
    withDeleted: !activeOnly,
    relations: ["role", "department"],
  };

  if (sortBy) {
    options.order = { [sortBy]: sortOrder ?? "ASC" };
  }

  if (pageIndex !== undefined && pageSize !== undefined) {
    options.take = pageSize;
    options.skip = (pageIndex - 1) * pageSize;
    return await userRepository.findAndCount(options);
  }

  const results = await userRepository.find(options);
  return [results, results.length];
}

async function updateUser(user: User): Promise<User> {
  return await userRepository.save(user);
}

async function deleteUser(user: User): Promise<User> {
  return await userRepository.softRemove(user);
}

async function recoverUser(user: User): Promise<User> {
  return await userRepository.recover(user);
}

async function getUserWithPermissions(userId: number): Promise<User | null> {
    return await userRepository.findOne({
        where: { id: userId },
        relations: ["role", "role.policies"],
    });
}

export {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserByPasswordResetToken,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  recoverUser,
  getUserWithPermissions,
};
