import { AppDataSource } from "../config/data-source";
import { Department } from "../entities/department.entity";
import { User } from "../entities/user.entity";
import {
    CreateDepartmentDto,
    UpdateDepartmentDto,
    DepartmentResponseDto,
    toDepartmentResponseDto,
    toDepartmentResponseDtoList,
} from "../dtos/department.dto";

const repository = AppDataSource.getRepository(Department);
const userRepository = AppDataSource.getRepository(User);

export class DepartmentService {

    static async createDepartment(data: CreateDepartmentDto): Promise<DepartmentResponseDto> {
        const manager = await userRepository.findOneBy({ id: data.manager_id });
        if (!manager) throw new Error("Manager not found");

        const department = repository.create({
            ...data,
            manager,
        });

        const saved = await repository.save(department);

        return toDepartmentResponseDto(saved);
    }

    static async getAllDepartments(activeOnly: boolean = false): Promise<DepartmentResponseDto[]> {
        const departments = await repository.find({
            withDeleted: !activeOnly,
            relations: ["manager"],
        });

        return toDepartmentResponseDtoList(departments);
    }

    static async getDepartmentById(id: number): Promise<DepartmentResponseDto | null> {
        const dept = await repository.findOne({
            where: { id },
            withDeleted: true,
            relations: ["manager"],
        });

        if (!dept) return null;

        return toDepartmentResponseDto(dept);
    }

    static async updateDepartment(
        id: number,
        data: UpdateDepartmentDto
    ): Promise<DepartmentResponseDto | null> {

        const dept = await repository.findOne({
            where: { id },
            withDeleted: true,
            relations: ["manager"],
        });

        if (!dept) return null;

        if (data.manager_id) {
            const manager = await userRepository.findOneBy({ id: data.manager_id });
            if (!manager) throw new Error("Manager not found");
            dept.manager = manager;
        }

        Object.assign(dept, data);

        await repository.save(dept);

        return toDepartmentResponseDto(dept);
    }

    static async deleteDepartment(id: number): Promise<boolean> {
        const dept = await repository.findOne({ where: { id } });
        if (!dept) return false;

        await repository.softRemove(dept);
        return true;
    }

    static async restoreDepartment(id: number): Promise<DepartmentResponseDto | null> {
        const dept = await repository.findOne({
            where: { id },
            withDeleted: true,
            relations: ["manager"],
        });

        if (!dept || !dept.deleted_at) return null;

        await repository.recover(dept);

        return toDepartmentResponseDto(dept);
    }
}