import { Request, Response } from "express";
import DepartmentService from "../services/department.service";
import { CreateDepartmentDto, DepartmentResponseDto, UpdateDepartmentDto } from "../dtos/department.dto";

export class DepartmentController {
    private readonly departmentService: DepartmentService;

    constructor(departmentService: DepartmentService) {
        this.departmentService = departmentService;
    }

    async getAllDepartments(
        req: Request<{}, DepartmentResponseDto[], {}>, 
        res: Response<DepartmentResponseDto[]>
    ) {
        const activeOnly = req.query.activeOnly === 'true';
        const departments = await this.departmentService.getAllDepartments(activeOnly);
        res.status(200).json(departments);
    }

    async getDepartmentById(
        req: Request<{ id: string }, DepartmentResponseDto, {}>, 
        res: Response<DepartmentResponseDto>
    ) {
        const id = Number(req.params.id);
        const department = await this.departmentService.getDepartmentById(id);
        res.status(200).json(department);
    }

    async createDepartment(
        req: Request<{}, DepartmentResponseDto, CreateDepartmentDto>, 
        res: Response<DepartmentResponseDto>
    ) {
        const newDepartment = await this.departmentService.createDepartment(req.body);
        res.status(201).json(newDepartment);
    }

    async updateDepartment(
        req: Request<{ id: string }, DepartmentResponseDto, UpdateDepartmentDto>, 
        res: Response<DepartmentResponseDto>
    ) {
        const id = Number(req.params.id);
        const updatedDepartment = await this.departmentService.updateDepartment(id, req.body);
        res.status(200).json(updatedDepartment);
    }

    async deleteDepartment(
        req: Request<{ id: string }, {}, {}>, 
        res: Response<{ message: string }>
    ) {
        const id = Number(req.params.id);
        await this.departmentService.deleteDepartment(id);
        res.status(200).json({ message: "Department deleted successfully" });
    }

    async restoreDepartment(
        req: Request<{ id: string }, DepartmentResponseDto, {}>, 
        res: Response<DepartmentResponseDto>
    ) {
        const id = Number(req.params.id);
        const restoredDepartment = await this.departmentService.restoreDepartment(id);
        res.status(200).json(restoredDepartment);
    }
}