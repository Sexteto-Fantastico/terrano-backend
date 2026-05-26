import { FindOptionsWhere, FindManyOptions, FindOptionsOrder } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { Department } from "../infra/entities/department.entity";
import { DepartmentQueryDto } from "../dtos/department.dto";

const departmentRepository = AppDataSource.getRepository(Department);

async function getAllDepartments(filters: DepartmentQueryDto = {}): Promise<[Department[], number]> {
    const { activeOnly = true, pageIndex, pageSize, sortBy, sortOrder } = filters;

    const where: FindOptionsWhere<Department> = {};

    const options: FindManyOptions<Department> = {
        where,
        withDeleted: !activeOnly,
        relations: ["manager"],
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return await departmentRepository.findAndCount(options);
    }

    const results = await departmentRepository.find(options);
    return [results, results.length];
}

async function getDepartmentById(id: number): Promise<Department | null> {
    return await departmentRepository.findOne({
        where: { id },
        withDeleted: true,
        relations: ["manager"],
    });
}

async function saveDepartment(data: Partial<Department>): Promise<Department> {
    const department = departmentRepository.create(data);
    return await departmentRepository.save(department);
}

async function deleteDepartment(id: number): Promise<boolean> {
    const department = await departmentRepository.findOne({ where: { id } });
    if (!department) return false;

    await departmentRepository.softRemove(department);
    return true;
}

async function restoreDepartment(id: number): Promise<Department | null> {
    const department = await departmentRepository.findOne({
        where: { id },
        withDeleted: true,
        relations: ["manager"],
    });

    if (!department || !department.deleted_at) return null;

    await departmentRepository.recover(department);
    return department;
}

export { getAllDepartments, getDepartmentById, saveDepartment, deleteDepartment, restoreDepartment };
