import { NextFunction, Request, Response } from "express";
import * as roleService from "../services/role.service";

async function createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const role = await roleService.createRole(req.body);
    res.status(201).json(role);
}

async function getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await roleService.getAllRoles(req.query);
    res.status(200).json(result.data);
}

async function getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const role = await roleService.getRoleById(Number(req.params.id));
    res.status(200).json(role);
}

async function updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const role = await roleService.updateRole(Number(req.params.id), req.body);
    res.status(200).json(role);
}

async function deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    await roleService.deleteRole(Number(req.params.id));
    res.status(204).send();
}

async function restoreRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const role = await roleService.restoreRole(Number(req.params.id));
    res.status(200).json(role);
}

async function assignPolicies(req: Request, res: Response, next: NextFunction): Promise<void> {
    const role = await roleService.assignPolicies(Number(req.params.id), req.body);
    res.status(200).json(role);
}

export {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    restoreRole,
    assignPolicies,
};
