import { Department } from "../infra/entities/department.entity";
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
import { IDepartmentRepository, DepartmentRepository } from "../repositories/department.repository";

const userRepository = AppDataSource.getRepository(User);

interface IDepartmentService {
    getAllDepartments(activeOnly?: boolean): Promise<DepartmentResponseDto[]>;
    getDepartmentById(id: number): Promise<DepartmentResponseDto>;
    createDepartment(data: CreateDepartmentDto): Promise<DepartmentResponseDto>;
    updateDepartment(id: number, data: UpdateDepartmentDto): Promise<DepartmentResponseDto>;
    deleteDepartment(id: number): Promise<boolean>;
    restoreDepartment(id: number): Promise<DepartmentResponseDto>;
}

class DepartmentService implements IDepartmentService {
    private readonly departmentRepository: IDepartmentRepository;

    constructor(departmentRepository: IDepartmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    async getAllDepartments(activeOnly: boolean = false): Promise<DepartmentResponseDto[]> {
        const allDepartments = await this.departmentRepository.findAllDepartments(activeOnly);
        return toDepartmentResponseDtoList(allDepartments);
    }

    async getDepartmentById(id: number): Promise<DepartmentResponseDto> {
        const department = await this.departmentRepository.findDepartmentById(id);
        if (!department) {
            throw new NotFoundError("Department not found");
        }
        return toDepartmentResponseDto(department);
    }

    async createDepartment(data: CreateDepartmentDto): Promise<DepartmentResponseDto> {
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

            const saved = await this.departmentRepository.saveDepartment(departmentData);
            return toDepartmentResponseDto(saved);
        } catch (error) {
            console.error("Error creating department:", error);
            throw error;
        }
    }

    async updateDepartment(id: number, data: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
        const existingDepartment = await this.departmentRepository.findDepartmentById(id);

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
        const saved = await this.departmentRepository.saveDepartment(updatedDepartment);
        
        return toDepartmentResponseDto(saved);
    }

    async deleteDepartment(id: number): Promise<boolean> {
        return this.departmentRepository.deleteDepartment(id);
    }

    async restoreDepartment(id: number): Promise<DepartmentResponseDto> {
        const restored = await this.departmentRepository.restoreDepartment(id);
        if (!restored) {
            throw new NotFoundError("Department not found or not deleted");
        }
        return toDepartmentResponseDto(restored);
    }
}

export default DepartmentService;