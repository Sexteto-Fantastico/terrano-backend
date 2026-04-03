import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
    ChangePasswordRequestDto,
    CreateUserRequestDto,
    DeleteUserRequestDto,
    GetUsersQueryDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from "../dtos/user.dto";

export class UserController {
    static async createUser(req: Request<{}, UserResponseDto, CreateUserRequestDto>, res: Response<UserResponseDto>) {
        const user = await UserService.createUser(req.body);
        res.status(201).json(user);
    }

    static async getUsers(req: Request<{}, UserResponseDto[], {}, GetUsersQueryDto>, res: Response<UserResponseDto[]>) {
        const users = await UserService.getUsers({
            name: req.query.name ? String(req.query.name) : undefined,
            only_active: req.query.only_active ? Boolean(req.query.only_active) : undefined,
        });
        res.json(users);
    }

    static async getUserById(req: Request<{ id: string }, UserResponseDto>, res: Response<UserResponseDto>) {
        const id = Number(req.params.id);
        const user = await UserService.getUserById(id);
        res.json(user);
    }

    static async updateUser(req: Request<{ id: string }, UserResponseDto, UpdateUserRequestDto>, res: Response<UserResponseDto>) {
        const id = Number(req.params.id);
        const user = await UserService.updateUser(id, req.body);
        res.json(user);
    }

    static async changePassword(req: Request<{ id: string }, UserResponseDto, ChangePasswordRequestDto>, res: Response<UserResponseDto>) {
        const id = Number(req.params.id);
        const user = await UserService.changePassword(id, req.body);
        res.json(user);
    }

    static async deleteUser(req: Request<{ id: string }, void, DeleteUserRequestDto>, res: Response<void>) {
        const id = Number(req.params.id);
        await UserService.deleteUser(id, req.body.updatedBy);
        res.status(204).send();
    }
}
