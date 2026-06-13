import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import {
    ChangePasswordBody,
    CreateUserBody,
    DeleteUserBody,
    UserQuery,
    UpdateUserBody,
    UserResponse,
} from "../dtos/user.dto";
import { BadRequestError } from "../errors";

async function createUser(req: Request<unknown, UserResponse, CreateUserBody>, res: Response<UserResponse>) {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
}

async function getUsers(req: Request<unknown, UserResponse[], unknown, UserQuery>, res: Response<UserResponse[]>) {
    const [users, total] = await UserService.getUsers(req.query);
    res.set("X-Total-Count", total.toString());
    res.json(users);
}

async function getUserById(req: Request<{ id: string }, UserResponse>, res: Response<UserResponse>) {
    const id = Number(req.params.id);
    const user = await UserService.getUserById(id);
    res.json(user);
}

async function updateUser(req: Request<{ id: string }, UserResponse, UpdateUserBody>, res: Response<UserResponse>) {
    const id = Number(req.params.id);
    const user = await UserService.updateUser(id, req.body);
    res.json(user);
}

async function changePassword(req: Request<{ id: string }, UserResponse, ChangePasswordBody>, res: Response<UserResponse>) {
    const id = Number(req.params.id);
    const user = await UserService.changePassword(id, req.body);
    res.json(user);
}

async function deleteUser(req: Request<{ id: string }, void, DeleteUserBody>, res: Response<void>) {
    const id = Number(req.params.id);
    await UserService.deleteUser(id, req.body?.updatedBy);
    res.status(204).send();
}

async function restoreUser(req: Request<{ id: string }, UserResponse, { updatedBy?: number }>, res: Response<UserResponse>) {
    const id = Number(req.params.id);
    const user = await UserService.restoreUser(id, req.body?.updatedBy);
    res.json(user);
}

async function uploadProfilePicture(req: Request<{ id: string }>, res: Response<UserResponse>) {
    const id = Number(req.params.id);

    if (!req.file) {
        throw new BadRequestError("No file provided. Please upload an image file.");
    }

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    const user = await UserService.updateProfilePicture(id, fileUrl);
    res.json(user);
}

export { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, restoreUser, uploadProfilePicture };