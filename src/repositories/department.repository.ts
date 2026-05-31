import { AppDataSource } from "../infra/config/data-source";
import { Department } from "../infra/entities/department.entity";
import {FindOptionsWhere, ILike} from "typeorm";

const departmentRepository = AppDataSource.getRepository(Department);

async function getAllDepartments(filters: { name?: string, activeOnly?: boolean; pageIndex?: number; pageSize?: number; } = {}): Promise<[Department[], number]> {
    const { name, activeOnly = true, pageIndex, pageSize } = filters;
    const where: FindOptionsWhere<Department> = {};

    if (activeOnly) where.is_active = true;
    if (name) where.name = ILike(`%${name}%`);

    const dbQuery: any = {
        where,
        relations: ["manager"],
        order: {id: "ASC"}
    };

    if (pageIndex !== undefined && pageSize !== undefined) {
        dbQuery.take = pageSize;
        dbQuery.skip = (pageIndex - 1) * pageSize;
        return await departmentRepository.findAndCount(dbQuery);
    }

    const results = await departmentRepository.find(dbQuery);
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
