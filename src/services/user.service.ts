import { User } from "../infra/entities/user.entity";
import { hashPassword } from "../utils/password.util";
import { formatCpf, isValidCpf, cleanCpf } from "../utils/cpf.util";
import {
  ChangePasswordRequestDto,
  CreateUserRequestDto,
  GetUsersQueryDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from "../dtos/user.dto";
import { BadRequestError, ConflictError, NotFoundError } from "../errors";
import {
  createUser as repoCreateUser,
  getUserByUsername,
  getUserByEmail,
  getUserById as repoGetUserById,
  getAllUsers,
  updateUser as repoUpdateUser,
} from "../repositories/user.repository";
import { getRoleById } from "../repositories/role.repository";
import { getDepartmentById } from "../repositories/department.repository";

function sanitizeUser(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    cpf: user.cpf,
    email: user.email,
    username: user.username,
    role: user.role && {
      id: user.role.id,
      name: user.role.name,
    },
    department: user.department && {
      id: user.department.id,
      name: user.department.name,
    },
    managedDepartments: (user.managed_departments ?? []).map((dept) => ({
      id: dept.id,
      name: dept.name,
    })),
    isActive: user.is_active,
    requiresPasswordReset: user.requires_password_reset,
  };
}

async function createUser(
  request: CreateUserRequestDto
): Promise<UserResponseDto> {
  const existingUser = await getUserByUsername(request.username);
  if (existingUser) {
    throw new ConflictError("Username already exists.");
  }

  const existingEmail = await getUserByEmail(request.email);
  if (existingEmail) {
    throw new ConflictError("Email already exists.");
  }

  const role = await getRoleById(request.roleId);
  if (!role) {
    throw new NotFoundError("Role not found.");
  }

  const department = await getDepartmentById(request.departmentId);
  if (!department) {
    throw new NotFoundError("Department not found.");
  }

  let cpfValue: string | undefined;
  if (request.cpf !== undefined && request.cpf !== null && request.cpf !== "") {
    const cleanedCpf = cleanCpf(request.cpf);
    if (!isValidCpf(cleanedCpf)) {
      throw new BadRequestError("Invalid CPF.");
    }
    cpfValue = formatCpf(cleanedCpf);
  }

  const user = new User({
    name: request.name,
    phone: request.phone,
    cpf: cpfValue,
    email: request.email,
    username: request.username,
    password: hashPassword(request.password),
    role,
    department,
    requires_password_reset: request.requiresPasswordReset ?? false,
    updated_by: request.updatedBy,
    is_active: true,
  });

  await repoCreateUser(user);
  return sanitizeUser(user);
}

async function getUsers(
  filters: GetUsersQueryDto
): Promise<[UserResponseDto[], number]> {
  const [users, total] = await getAllUsers(filters);
  return [users.map(sanitizeUser), total];
}

async function getUserById(id: number): Promise<UserResponseDto> {
  const user = await repoGetUserById(id, true);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return sanitizeUser(user);
}

async function updateUser(
  id: number,
  request: UpdateUserRequestDto
): Promise<UserResponseDto> {
  const user = await repoGetUserById(id, true);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (request.username && request.username !== user.username) {
    const existingUser = await getUserByUsername(request.username);
    if (existingUser && existingUser.id !== user.id) {
      throw new ConflictError("Username already exists.");
    }
    user.username = request.username;
  }

  if (request.name !== undefined) {
    user.name = request.name;
  }

  if (request.phone !== undefined) {
    user.phone = request.phone;
  }

  if (request.cpf !== undefined) {
    if (request.cpf === null || request.cpf === "") {
      user.cpf = undefined;
    } else {
      const cleanedCpf = cleanCpf(request.cpf);
      if (!isValidCpf(cleanedCpf)) {
        throw new BadRequestError("Invalid CPF.");
      }
      user.cpf = formatCpf(cleanedCpf);
    }
  }

  if (request.email !== undefined) {
    if (request.email !== user.email) {
      const existingEmail = await getUserByEmail(request.email);
      if (existingEmail && existingEmail.id !== user.id) {
        throw new ConflictError("Email already exists.");
      }
    }
    user.email = request.email;
  }

  if ("password" in request) {
    throw new BadRequestError(
      "Use the dedicated password route to update the password."
    );
  }

  if (request.roleId !== undefined) {
    const role = await getRoleById(request.roleId);
    if (!role) {
      throw new NotFoundError("Role not found.");
    }
    user.role = role;
  }

  if (request.departmentId !== undefined) {
    const department = await getDepartmentById(request.departmentId);
    if (!department) {
      throw new NotFoundError("Department not found.");
    }
    user.department = department;
  }

  if (request.updatedBy !== undefined) {
    user.updated_by = request.updatedBy;
  }

  await repoUpdateUser(user);
  return sanitizeUser(user);
}

async function changePassword(
  id: number,
  request: ChangePasswordRequestDto
): Promise<UserResponseDto> {
  const user = await repoGetUserById(id, true);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  user.password = hashPassword(request.password);
  user.requires_password_reset = false;
  user.password_reset_token = undefined;
  user.password_reset_token_expires_at = undefined;
  if (request.updatedBy !== undefined) {
    user.updated_by = request.updatedBy;
  }

  await repoUpdateUser(user);
  return sanitizeUser(user);
}

async function deleteUser(
  id: number,
  updatedBy?: number
): Promise<UserResponseDto> {
  const user = await repoGetUserById(id, true);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  user.is_active = false;
  if (updatedBy !== undefined) {
    user.updated_by = updatedBy;
  }

  await repoUpdateUser(user);
  return sanitizeUser(user);
}

async function restoreUser(
  id: number,
  updatedBy?: number
): Promise<UserResponseDto> {
  const user = await repoGetUserById(id, true);
  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (user.is_active) {
    throw new BadRequestError("User is not deleted.");
  }

  user.is_active = true;
  if (updatedBy !== undefined) {
    user.updated_by = updatedBy;
  }

  await repoUpdateUser(user);
  return sanitizeUser(user);
}

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changePassword,
  deleteUser,
  restoreUser,
};
