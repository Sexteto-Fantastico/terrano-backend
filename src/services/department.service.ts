import {
    CreateDepartmentDto,
    UpdateDepartmentDto,
    DepartmentResponseDto,
    toDepartmentResponseDto,
    toDepartmentResponseDtoList,
} from "../dtos/department.dto";
import { NotFoundError, BadRequestError } from "../errors/app-error";
import * as DepartmentRepository from "../repositories/department.repository";
import * as UserRepository from "../repositories/user.repository";

async function getAllDepartments(filters: { activeOnly?: boolean; pageIndex?: number; pageSize?: number; } = {}): Promise<[DepartmentResponseDto[], number]> {
    const [allDepartments, total] = await DepartmentRepository.getAllDepartments(filters);
    return [toDepartmentResponseDtoList(allDepartments), total];
}

async function getDepartmentById(id: number): Promise<DepartmentResponseDto> {
    const department = await DepartmentRepository.getDepartmentById(id);
    if (!department) {
        throw new NotFoundError("Department not found");
    }
    return toDepartmentResponseDto(department);
}

async function createDepartment(data: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const { managerId,  isActive ,...rest } = data;

    const manager = await UserRepository.getUserById(managerId);
    
    if (!manager) {
        throw new NotFoundError("Manager not found");
    }

    const departmentData = {
        ...rest,
        manager_id: managerId,
        manager,
        is_active: isActive ?? true,
        created_at: new Date(),
    };

    const saved = await DepartmentRepository.saveDepartment(departmentData);
    return toDepartmentResponseDto(saved);
}

async function updateDepartment(id: number, data: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
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

    if (data.isActive !== undefined) existingDepartment.is_active = data.isActive;

    existingDepartment.updated_at = new Date();

    const saved = await DepartmentRepository.saveDepartment(existingDepartment);
    
    return toDepartmentResponseDto(saved);
}

async function deleteDepartment(id: number): Promise<boolean> {
    return DepartmentRepository.deleteDepartment(id);
}

async function restoreDepartment(id: number): Promise<DepartmentResponseDto> {
    const restored = await DepartmentRepository.restoreDepartment(id);
    if (!restored) {
        throw new NotFoundError("Department not found or not deleted");
    }
    return toDepartmentResponseDto(restored);
}

export { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, restoreDepartment };