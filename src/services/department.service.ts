import { User } from "../infra/entities/user.entity";
import { AppDataSource } from "../infra/config/data-source";
import {
    CreateDepartmentDto,
    UpdateDepartmentDto,
    DepartmentResponseDto,
    toDepartmentResponseDto,
    toDepartmentResponseDtoList,
} from "../dtos/department.dto";
import { NotFoundError } from "../errors/app-error";
import * as DepartmentRepository from "../repositories/department.repository";

const userRepository = AppDataSource.getRepository(User);

async function getAllDepartments(activeOnly: boolean = false): Promise<DepartmentResponseDto[]> {
    const allDepartments = await DepartmentRepository.getAllDepartments(activeOnly);
    return toDepartmentResponseDtoList(allDepartments);
}

async function getDepartmentById(id: number): Promise<DepartmentResponseDto> {
    const department = await DepartmentRepository.getDepartmentById(id);
    if (!department) {
        throw new NotFoundError("Department not found");
    }
    return toDepartmentResponseDto(department);
}

async function createDepartment(data: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    try {
        const { manager_id, ...rest } = data;

        if (!manager_id) {
            throw new Error("Manager ID is required");
        }

        const manager = await userRepository.findOneBy({ id: manager_id });
        
        if (!manager) {
            throw new NotFoundError("Manager not found");
        }

        const departmentData = {
            ...rest,
            manager,
        };

        const saved = await DepartmentRepository.saveDepartment(departmentData);
        return toDepartmentResponseDto(saved);
    } catch (error) {
        console.error("Error creating department:", error);
        throw error;
    }
}

async function updateDepartment(id: number, data: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    const existingDepartment = await DepartmentRepository.getDepartmentById(id);

    if (!existingDepartment) {
        throw new NotFoundError("Department not found");
    }

    if (data.manager_id) {
        const manager = await userRepository.findOneBy({ id: data.manager_id });
        if (!manager) {
            throw new NotFoundError("Manager not found");
        }
        existingDepartment.manager = manager;
    }

    const updatedDepartment = Object.assign(existingDepartment, data);
    const saved = await DepartmentRepository.saveDepartment(updatedDepartment);
    
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