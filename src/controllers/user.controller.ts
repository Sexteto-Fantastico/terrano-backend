import { Request, Response } from "express";
import { createUser as serviceCreateUser, getUsers as serviceGetUsers, getUserById as serviceGetUserById, updateUser as serviceUpdateUser, changePassword as serviceChangePassword, deleteUser as serviceDeleteUser } from "../services/user.service";
import {
    ChangePasswordRequestDto,
    CreateUserRequestDto,
    DeleteUserRequestDto,
    GetUsersQueryDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from "../dtos/user.dto";

async function createUser(req: Request<{}, UserResponseDto, CreateUserRequestDto>, res: Response<UserResponseDto>) {
        const user = await serviceCreateUser(req.body);
        res.status(201).json(user);
    }

async function getUsers(req: Request<{}, UserResponseDto[], {}, GetUsersQueryDto>, res: Response<UserResponseDto[]>) {
        const users = await serviceGetUsers({
            name: req.query.name ? String(req.query.name) : undefined,
            only_active: req.query.only_active === "true" ? true : undefined,
        });
        res.json(users);
    }

async function getUserById(req: Request<{ id: string }, UserResponseDto>, res: Response<UserResponseDto>) {
        const id = Number(req.params.id);
        const user = await serviceGetUserById(id);
        res.json(user);
    }

async function updateUser(req: Request<{ id: string }, UserResponseDto, UpdateUserRequestDto>, res: Response<UserResponseDto>) {
        const id = Number(req.params.id);
        const user = await serviceUpdateUser(id, req.body);
        res.json(user);
    }

async function changePassword(req: Request<{ id: string }, UserResponseDto, ChangePasswordRequestDto>, res: Response<UserResponseDto>) {
        const id = Number(req.params.id);
        const user = await serviceChangePassword(id, req.body);
        res.json(user);
    }

async function deleteUser(req: Request<{ id: string }, void, DeleteUserRequestDto>, res: Response<void>) {
        const id = Number(req.params.id);
        await serviceDeleteUser(id, req.body.updatedBy);
        res.status(204).send();
    }

export { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser };