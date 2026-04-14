import { AppDataSource } from "../infra/config/data-source";
import { Department } from "../infra/entities/department.entity";

const departmentRepository = AppDataSource.getRepository(Department);

async function getDepartmentById(id: number): Promise<Department | null> {
    return await departmentRepository.findOne({ where: { id } });
}

export { getDepartmentById };
