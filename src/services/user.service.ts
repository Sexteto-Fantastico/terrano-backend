import { FindOptionsWhere, ILike } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/role.entity";
import { Department } from "../entities/department.entity";
import { User } from "../entities/user.entity";
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

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const departmentRepository = AppDataSource.getRepository(Department);

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
        managed_departments: (user.managed_departments ?? []).map((dept) => ({
            id: dept.id,
            name: dept.name,
        })),
        is_active: user.is_active,
    };
}

export class UserService {
    static async createUser(request: CreateUserRequestDto): Promise<UserResponseDto> {
        const existingUser = await userRepository.findOne({ where: { username: request.username } });
        if (existingUser) {
            throw new ConflictError("Username already exists.");
        }

        const existingEmail = await userRepository.findOne({ where: { email: request.email } });
        if (existingEmail) {
            throw new ConflictError("Email already exists.");
        }

        const role = await roleRepository.findOne({ where: { id: request.roleId } });
        if (!role) {
            throw new NotFoundError("Role not found.");
        }

        const department = await departmentRepository.findOne({ where: { id: request.departmentId } });
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
            updated_by: request.updatedBy,
            is_active: true,
        });

        await user.save();
        return sanitizeUser(user);
    }

    static async getUsers(filters: GetUsersQueryDto): Promise<UserResponseDto[]> {
        const where: FindOptionsWhere<User> = {};

        if (filters.only_active) where.is_active = true;
        if (filters.name) where.name = ILike(`%${filters.name}%`);

        const users = await userRepository.find({
            where,
            relations: ["role", "department"],
            order: { name: "ASC" },
        });

        return users.map(sanitizeUser);
    }

    static async getUserById(id: number): Promise<UserResponseDto> {
        const user = await userRepository.findOne({
            where: { id, is_active: true },
            relations: ["role", "department"],
        });

        if (!user) {
            throw new NotFoundError("User not found.");
        }

        return sanitizeUser(user);
    }

    static async updateUser(id: number, request: UpdateUserRequestDto): Promise<UserResponseDto> {
        const user = await userRepository.findOne({ where: { id, is_active: true }, relations: ["role"] });
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        if (request.username && request.username !== user.username) {
            const existingUser = await userRepository.findOne({ where: { username: request.username } });
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
                const existingEmail = await userRepository.findOne({ where: { email: request.email } });
                if (existingEmail && existingEmail.id !== user.id) {
                    throw new ConflictError("Email already exists.");
                }
            }
            user.email = request.email;
        }
 
        if ("password" in request) {
            throw new BadRequestError("Use the dedicated password route to update the password.");
        }

        if (request.roleId !== undefined) {
            const role = await roleRepository.findOne({ where: { id: request.roleId } });
            if (!role) {
                throw new NotFoundError("Role not found.");
            }
            user.role = role;
        }

        if (request.departmentId !== undefined) {
            const department = await departmentRepository.findOne({ where: { id: request.departmentId } });
            if (!department) {
                throw new NotFoundError("Department not found.");
            }
            user.department = department;
        }

        if (request.updatedBy !== undefined) {
            user.updated_by = request.updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }

    static async changePassword(id: number, request: ChangePasswordRequestDto): Promise<UserResponseDto> {
        const user = await userRepository.findOne({ where: { id, is_active: true }, relations: ["role", "department"] });
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        if (!request.password) {
            throw new BadRequestError("Password is required.");
        }

        user.password = hashPassword(request.password);
        if (request.updatedBy !== undefined) {
            user.updated_by = request.updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }

    static async deleteUser(id: number, updatedBy?: number): Promise<UserResponseDto> {
        const user = await userRepository.findOne({ where: { id, is_active: true }, relations: ["role", "department"] });
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        user.is_active = false;
        if (updatedBy !== undefined) {
            user.updated_by = updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }
}
