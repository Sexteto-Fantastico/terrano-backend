import { FindOptionsWhere, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { User } from "../infra/entities/user.entity";

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
  token: string
): Promise<User | null> {
  return await userRepository.findOne({
    where: { password_reset_token: token },
  });
}

async function getUserById(
  id: number,
  activeOnly: boolean = false
): Promise<User | null> {
  const where: FindOptionsWhere<User> = { id };
  if (activeOnly) where.is_active = true;

  return await userRepository.findOne({
    where,
    relations: ["role", "department"],
  });
}

async function getAllUsers(
  filters: {
    onlyActive?: boolean;
    name?: string;
    pageIndex?: number;
    pageSize?: number;
  } = {}
): Promise<[User[], number]> {
  const { onlyActive, name, pageIndex, pageSize } = filters;
  const where: FindOptionsWhere<User> = {};

  if (onlyActive) where.is_active = true;
  if (name) where.name = ILike(`%${name}%`);

  const dbQuery: any = {
    where,
    relations: ["role", "department"],
    order: { name: "ASC" },
  };

  if (pageIndex !== undefined && pageSize !== undefined) {
    dbQuery.take = pageSize;
    dbQuery.skip = (pageIndex - 1) * pageSize;
    return await userRepository.findAndCount(dbQuery);
  }

  const results = await userRepository.find(dbQuery);
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
