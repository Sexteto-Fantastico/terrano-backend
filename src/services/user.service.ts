import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";
import { hashPassword } from "../utils/password.util";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);

export interface CreateUserPayload {
    name: string;
    phone?: string;
    username: string;
    password: string;
    roleId: string;
    updatedBy?: string;
}

export interface UpdateUserPayload {
    name?: string;
    phone?: string;
    username?: string;
    password?: string;
    roleId?: string;
    updatedBy?: string;
}

function sanitizeUser(user: User): Omit<User, "password"> {
    const { password, ...rest } = user;
    return rest as Omit<User, "password">;
}

export class UserService {
    static async createUser(payload: CreateUserPayload): Promise<Omit<User, "password">> {
        const existingUser = await userRepository.findOne({ where: { username: payload.username } });
        if (existingUser) {
            throw new Error("Username already exists.");
        }

        const role = await roleRepository.findOne({ where: { id: payload.roleId } });
        if (!role) {
            throw new Error("Role not found.");
        }

        const user = new User({
            name: payload.name,
            phone: payload.phone,
            username: payload.username,
            password: hashPassword(payload.password),
            role,
            updated_by: payload.updatedBy,
            isActive: true,
        });

        await user.save();
        return sanitizeUser(user);
    }

    static async getUsers(): Promise<Array<Omit<User, "password">>> {
        const users = await userRepository.find({
            where: { isActive: true },
            relations: ["role"],
            order: { created_at: "ASC" }
        });
        return users.map(sanitizeUser);
    }

    static async getUserById(id: string): Promise<Omit<User, "password">> {
        const user = await userRepository.findOne({
            where: { id, isActive: true },
            relations: ["role"]
        });

        if (!user) {
            throw new Error("User not found.");
        }

        return sanitizeUser(user);
    }

    static async updateUser(id: string, payload: UpdateUserPayload): Promise<Omit<User, "password">> {
        const user = await userRepository.findOne({ where: { id, isActive: true }, relations: ["role"] });
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

        if (payload.password) {
            user.password = hashPassword(payload.password);
        }

        if (payload.roleId) {
            const role = await roleRepository.findOne({ where: { id: payload.roleId } });
            if (!role) {
                throw new Error("Role not found.");
            }
            user.role = role;
        }

        if (payload.updatedBy !== undefined) {
            user.updated_by = payload.updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }

    static async deleteUser(id: string, updatedBy?: string): Promise<Omit<User, "password">> {
        const user = await userRepository.findOne({ where: { id, isActive: true }, relations: ["role"] });
        if (!user) {
            throw new Error("User not found.");
        }

        user.isActive = false;
        if (updatedBy !== undefined) {
            user.updated_by = updatedBy;
        }

        await user.save();
        return sanitizeUser(user);
    }
}
