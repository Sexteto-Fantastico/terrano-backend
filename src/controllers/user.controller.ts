import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import {
    ChangePasswordRequestDto,
    CreateUserRequestDto,
    DeleteUserRequestDto,
    GetUsersQueryDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from "../dtos/user.dto";

async function createUser(req: Request<unknown, UserResponseDto, CreateUserRequestDto>, res: Response<UserResponseDto>) {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
}

async function getUsers(req: Request<unknown, UserResponseDto[], unknown, GetUsersQueryDto>, res: Response<UserResponseDto[]>) {
    const [users, total] = await UserService.getUsers(req.query);
    res.set("X-Total-Count", total.toString());
    res.json(users);
}

async function getUserById(req: Request<{ id: string }, UserResponseDto>, res: Response<UserResponseDto>) {
    const id = Number(req.params.id);
    const user = await UserService.getUserById(id);
    res.json(user);
}

async function updateUser(req: Request<{ id: string }, UserResponseDto, UpdateUserRequestDto>, res: Response<UserResponseDto>) {
    const id = Number(req.params.id);
    const user = await UserService.updateUser(id, req.body);
    res.json(user);
}

async function changePassword(req: Request<{ id: string }, UserResponseDto, ChangePasswordRequestDto>, res: Response<UserResponseDto>) {
    const id = Number(req.params.id);
    const user = await UserService.changePassword(id, req.body);
    res.json(user);
}

async function deleteUser(req: Request<{ id: string }, void, DeleteUserRequestDto>, res: Response<void>) {
    const id = Number(req.params.id);
    await UserService.deleteUser(id, req.body?.updatedBy);
    res.status(204).send();
}

async function restoreUser(req: Request<{ id: string }, UserResponseDto, { updatedBy?: number }>, res: Response<UserResponseDto>) {
    const id = Number(req.params.id);
    const user = await UserService.restoreUser(id, req.body?.updatedBy);
    res.json(user);
}

export { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, restoreUser };