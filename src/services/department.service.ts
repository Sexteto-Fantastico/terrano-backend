import {
    CreateDepartment,
    UpdateDepartment,
    DepartmentResponse,
    DepartmentQuery,
    toDepartmentResponse,
    toDepartmentResponseList,
} from "../dtos/department.dto";
import { NotFoundError, BadRequestError } from "../errors/app-error";
import * as DepartmentRepository from "../repositories/department.repository";
import * as UserRepository from "../repositories/user.repository";

async function getAllDepartments(filters: DepartmentQuery = {}): Promise<[DepartmentResponse[], number]> {
    const [allDepartments, total] = await DepartmentRepository.getAllDepartments(filters);
    return [toDepartmentResponseList(allDepartments), total];
}

async function getDepartmentById(id: number): Promise<DepartmentResponse> {
    const department = await DepartmentRepository.getDepartmentById(id);
    if (!department) {
        throw new NotFoundError("Department not found");
    }
    return toDepartmentResponse(department);
}

async function createDepartment(data: CreateDepartment): Promise<DepartmentResponse> {
    const { managerId, ...rest } = data;

    const manager = await UserRepository.getUserById(managerId);

    if (!manager) {
        throw new NotFoundError("Manager not found");
    }

    const departmentData = {
        ...rest,
        manager_id: managerId,
        manager,
        created_at: new Date(),
    };

    const saved = await DepartmentRepository.saveDepartment(departmentData);
    return toDepartmentResponse(saved);
}

async function updateDepartment(id: number, data: UpdateDepartment): Promise<DepartmentResponse> {
    const existingDepartment = await DepartmentRepository.getDepartmentById(id);

    if (!existingDepartment) {
        throw new NotFoundError("Department not found");
    }

    if (data.managerId) {
        const manager = await UserRepository.getUserById(data.managerId);
        if (!manager) {
            throw new NotFoundError("Manager not found");
        }
        existingDepartment.manager = manager;
    }

    if (data.name !== undefined) existingDepartment.name = data.name;

    existingDepartment.updated_at = new Date();

    const saved = await DepartmentRepository.saveDepartment(existingDepartment);
    
    return toDepartmentResponse(saved);
}

async function deleteDepartment(id: number): Promise<boolean> {
    return DepartmentRepository.deleteDepartment(id);
}

async function restoreDepartment(id: number): Promise<DepartmentResponse> {
    const restored = await DepartmentRepository.restoreDepartment(id);
    if (!restored) {
        throw new NotFoundError("Department not found or not deleted");
    }
    return toDepartmentResponse(restored);
}

export { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, restoreDepartment };