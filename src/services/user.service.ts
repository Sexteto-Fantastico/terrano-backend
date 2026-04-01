import { FindOptionsWhere, ILike, Like } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/role.entity";
import { Department } from "../entities/department.entity";
import { User } from "../entities/user.entity";
import { hashPassword } from "../utils/password.util";
import { formatCpf, isValidCpf, cleanCpf } from "../utils/cpf.util";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const departmentRepository = AppDataSource.getRepository(Department);

export interface CreateUserPayload {
    name: string;
    phone?: string;
    cpf?: string;
    email: string;
    username: string;
    password: string;
    roleId: number;
    departmentId: number;
    updatedBy?: number;
}

export interface UpdateUserPayload {
    name?: string;
    phone?: string;
    cpf?: string;
    email?: string;
    username?: string;
    roleId?: number;
    departmentId?: number;
    updatedBy?: number;
}

export interface ChangeUserPasswordPayload {
    password: string;
    updatedBy?: number;
}

function sanitizeUser(user: User): Omit<User, "password"> {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        email: user.email,
        username: user.username,
        role: user.role && {
            id: user.role.id,
            name: user.role.name
        },
        department: user.department && {
            id: user.department.id,
            name: user.department.name
        },
        managed_departments: (user.managed_departments ?? []).map((dept) => ({
            id: dept.id,
            name: dept.name
        })),
        is_active: user.is_active,
    } as Omit<User, "password">;
}

export class UserService {
    static async createUser(payload: CreateUserPayload): Promise<Omit<User, "password">> {
        const existingUser = await userRepository.findOne({ where: { username: payload.username } });
        if (existingUser) {
            throw new Error("Username already exists.");
        }

        const existingEmail = await userRepository.findOne({ where: { email: payload.email } });
        if (existingEmail) {
            throw new Error("Email already exists.");
        }

        const role = await roleRepository.findOne({ where: { id: payload.roleId } });
        if (!role) {
            throw new Error("Role not found.");
        }

        const department = await departmentRepository.findOne({ where: { id: payload.departmentId } });
        if (!department) {
            throw new Error("Department not found.");
        }

        let cpfValue: string | undefined;
        if (payload.cpf !== undefined && payload.cpf !== null && payload.cpf !== "") {
            const cleanedCpf = cleanCpf(payload.cpf);
            if (!isValidCpf(cleanedCpf)) {
                throw new Error("Invalid CPF.");
            }
            cpfValue = formatCpf(cleanedCpf);
        }

        const user = new User({
            name: payload.name,
            phone: payload.phone,
            cpf: cpfValue,
            email: payload.email,
            username: payload.username,
            password: hashPassword(payload.password),
            role,
            department,
            updated_by: payload.updatedBy,
            is_active: true,
        });

        await user.save();
        return sanitizeUser(user);
    }

    static async getUsers(filters: { name?: string; only_active?: boolean }): Promise<Array<Omit<User, "password">>> {
        const where: FindOptionsWhere<User> = {};
        
        if (filters.only_active) where.is_active = true;
        if (filters.name) where.name = ILike(`%${filters.name}%`);
        
        const users = await userRepository.find({
            where,
            relations: ["role", "department"],
            order: { name: "ASC" }
        });
        
        return users.map(sanitizeUser);
    }

    static async getUserById(id: number): Promise<Omit<User, "password">> {
        const user = await userRepository.findOne({
            where: { id, is_active: true },
            relations: ["role", "department"]
        });

        if (!user) {
            throw new Error("User not found.");
        }

        return sanitizeUser(user);
    }

    static async updateUser(id: number, payload: UpdateUserPayload): Promise<Omit<User, "password">> {
        const user = await userRepository.findOne({ where: { id, is_active: true }, relations: ["role"] });
        if (!user) {
            throw new Error("User not found.");
        }

        if (payload.username && payload.username !== user.username) {
            const existingUser = await userRepository.findOne({ where: { username: payload.username } });
            if (existingUser && existingUser.id !== user.id) {
                throw new Error("Username already exists.");
            }
            user.username = payload.username;
        }

        if (payload.name !== undefined) {
            user.name = payload.name;
        }

        if (payload.phone !== undefined) {
            user.phone = payload.phone;
        }

        if (payload.cpf !== undefined) {
            if (payload.cpf === null || payload.cpf === "") {
                user.cpf = undefined;
            } else {
                const cleanedCpf = cleanCpf(payload.cpf);
                if (!isValidCpf(cleanedCpf)) {
                    throw new Error("Invalid CPF.");
                }
                user.cpf = formatCpf(cleanedCpf);
            }
        }

        if (payload.email !== undefined) {
            if (payload.email !== user.email) {
                const existingEmail = await userRepository.findOne({ where: { email: payload.email } });
                if (existingEmail && existingEmail.id !== user.id) {
                    throw new Error("Email already exists.");
                }
            }
            user.email = payload.email;
        }

        if ("password" in payload) {
            throw new Error("Use the dedicated password route to update the password.");
        }

        if (payload.roleId !== undefined) {
            const role = await roleRepository.findOne({ where: { id: payload.roleId } });
            if (!role) {
                throw new Error("Role not found.");
            }
            user.role = role;
        }

        if (payload.departmentId !== undefined) {
            const department = await departmentRepository.findOne({ where: { id: payload.departmentId } });
            if (!department) {
                throw new Error("Department not found.");
            }
            user.department = department;
        }

        if (payload.updatedBy !== undefined) {
            user.updated_by = payload.updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }

    static async changePassword(id: number, payload: ChangeUserPasswordPayload): Promise<Omit<User, "password">> {
        const user = await userRepository.findOne({ where: { id, is_active: true }, relations: ["role", "department"] });
        if (!user) {
            throw new Error("User not found.");
        }

        if (!payload.password) {
            throw new Error("Password is required.");
        }

        user.password = hashPassword(payload.password);
        if (payload.updatedBy !== undefined) {
            user.updated_by = payload.updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }

    static async deleteUser(id: number, updatedBy?: number): Promise<Omit<User, "password">> {
        const user = await userRepository.findOne({ where: { id, is_active: true }, relations: ["role", "department"] });
        if (!user) {
            throw new Error("User not found.");
        }

        user.is_active = false;
        if (updatedBy !== undefined) {
            user.updated_by = updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }
}
