import { AppDataSource } from "../infra/config/data-source";
import { Department } from "../infra/entities/department.entity";

const departmentRepository = AppDataSource.getRepository(Department);

async function getAllDepartments(activeOnly: boolean = false): Promise<Department[]> {
    return await departmentRepository.find({
        withDeleted: !activeOnly,
        relations: ["manager"],
    });
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
