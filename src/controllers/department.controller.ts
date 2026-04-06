import { Request, Response } from "express";
import { DepartmentService } from "../services/department.service";
import { NotFoundError } from "../errors";

export class DepartmentController {

    static async create(req: Request, res: Response) {
        const dept = await DepartmentService.createDepartment(req.body);
        res.status(201).json(dept);
    }

    static async getAll(req: Request, res: Response) {
        const activeOnly = req.query.active === "true";
        const list = await DepartmentService.getAllDepartments(activeOnly);
        res.status(200).json(list);
    }

    static async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const dept = await DepartmentService.getDepartmentById(id);

        if (!dept) throw new NotFoundError("Department not found");

        res.status(200).json(dept);
    }

    static async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const dept = await DepartmentService.updateDepartment(id, req.body);

        if (!dept) throw new NotFoundError("Department not found");

        res.status(200).json(dept);
    }

    static async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        const success = await DepartmentService.deleteDepartment(id);

        if (!success) throw new NotFoundError("Department not found");

        res.status(200).json({ message: "Department deleted successfully" });
    }

    static async restore(req: Request, res: Response) {
        const id = Number(req.params.id);
        const dept = await DepartmentService.restoreDepartment(id);

        if (!dept) throw new NotFoundError("Department not found or not deleted");

        res.status(200).json(dept);
    }
}