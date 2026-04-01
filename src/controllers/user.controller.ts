import { Request, Response } from "express";
import { UserService } from "../services/user.service";

function errorResponse(error: unknown, res: Response) {
    const message = error instanceof Error ? error.message : "Internal server error.";
    let status = 400;

    if (error instanceof Error) {
        if (/not found|inactive/i.test(error.message)) {
            status = 404;
        } else if (/exists/i.test(error.message)) {
            status = 409;
        }
    }

    return res.status(status).json({ message });
}

export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const payload = {
                ...req.body,
                roleId: Number(req.body.roleId ?? req.body.role?.id),
                departmentId: Number(req.body.departmentId ?? req.body.department?.id),
            };

            const user = await UserService.createUser(payload);
            return res.status(201).json(user);
        } catch (error) {
            return errorResponse(error, res);
        }
    }

    static async getUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getUsers({
                name: req.query.name ? String(req.query.name) : undefined,
                only_active: req.query.only_active ? Boolean(req.query
                    .only_active) : undefined
            });
            return res.json(users);
        } catch (error) {
            return errorResponse(error, res);
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const user = await UserService.getUserById(id);
            return res.json(user);
        } catch (error) {
            return errorResponse(error, res);
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const payload = {
                ...req.body,
                roleId: req.body.roleId !== undefined ? Number(req.body.roleId) : req.body.role?.id !== undefined ? Number(req.body.role.id) : undefined,
                departmentId: req.body.departmentId !== undefined ? Number(req.body.departmentId) : req.body.department?.id !== undefined ? Number(req.body.department.id) : undefined,
            };
            const user = await UserService.updateUser(id, payload);
            return res.json(user);
        } catch (error) {
            return errorResponse(error, res);
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const user = await UserService.changePassword(id, req.body);
            return res.json(user);
        } catch (error) {
            return errorResponse(error, res);
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await UserService.deleteUser(id, req.body.updatedBy as number | undefined);
            return res.status(204).send();
        } catch (error) {
            return errorResponse(error, res);
        }
    }
}
