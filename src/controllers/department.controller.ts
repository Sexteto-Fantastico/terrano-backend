import { Request, Response } from "express";
import * as DepartmentService from "../services/department.service";
import { CreateDepartmentDto, DepartmentResponseDto, UpdateDepartmentDto } from "../dtos/department.dto";

async function getAllDepartments(
    req: Request<DepartmentResponseDto[]>,
    res: Response<DepartmentResponseDto[]>
) {
    const [departments, total] = await DepartmentService.getAllDepartments(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(departments);
}

async function getDepartmentById(
    req: Request<{ id: string }, DepartmentResponseDto>,
    res: Response<DepartmentResponseDto>
) {
    const id = Number(req.params.id);
    const department = await DepartmentService.getDepartmentById(id);
    res.status(200).json(department);
}

async function createDepartment(
    req: Request<DepartmentResponseDto, CreateDepartmentDto>,
    res: Response<DepartmentResponseDto>
) {
    const newDepartment = await DepartmentService.createDepartment(req.body);
    res.status(201).json(newDepartment);
}

async function updateDepartment(
    req: Request<{ id: string }, DepartmentResponseDto, UpdateDepartmentDto>,
    res: Response<DepartmentResponseDto>
) {
    const id = Number(req.params.id);
    const updatedDepartment = await DepartmentService.updateDepartment(id, req.body);
    res.status(200).json(updatedDepartment);
}

async function deleteDepartment(
    req: Request<{ id: string }>,
    res: Response<{ message: string }>
) {
    const id = Number(req.params.id);
    await DepartmentService.deleteDepartment(id);
    res.status(200).json({ message: "Department deleted successfully" });
}

async function restoreDepartment(
    req: Request<{ id: string }, DepartmentResponseDto>,
    res: Response<DepartmentResponseDto>
) {
    const id = Number(req.params.id);
    const restoredDepartment = await DepartmentService.restoreDepartment(id);
    res.status(200).json(restoredDepartment);
}

export { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, restoreDepartment };