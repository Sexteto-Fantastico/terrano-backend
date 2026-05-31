import { FindOptionsWhere, FindManyOptions, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { User } from "../infra/entities/user.entity";
import { UserQuery } from "../dtos/user.dto";

const userRepository = AppDataSource.getRepository(User);

async function createUser(user: User): Promise<User> {
  return await userRepository.save(user);
}

async function getUserByUsername(username: string): Promise<User | null> {
  return await userRepository.findOne({ where: { username } });
}

async function getUserByEmail(email: string): Promise<User | null> {
  return await userRepository.findOne({ where: { email } });
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
  activeOnly: boolean = false,
): Promise<User | null> {
  const where: FindOptionsWhere<User> = { id };
  if (activeOnly) where.is_active = true;

  return await userRepository.findOne({
    where,
    relations: ["role", "department"],
  });
}

async function getAllUsers(filters: UserQuery = {}): Promise<[User[], number]> {
  const { activeOnly = true, pageIndex, pageSize, sortBy, sortOrder } = filters;

  const where: FindOptionsWhere<User> = {};

  if (activeOnly) {
    where.is_active = true;
  }
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

export {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserByPasswordResetToken,
  getUserById,
  getAllUsers,
  updateUser,
};
