import { AppDataSource } from "../infra/config/data-source";
import { Department } from "../infra/entities/department.entity";
import { User } from "../infra/entities/user.entity";

const departmentRepository = AppDataSource.getRepository(Department);
const userRepository = AppDataSource.getRepository(User);

export interface IDepartmentRepository {
    findAllDepartments(activeOnly?: boolean): Promise<Department[]>;
    findDepartmentById(id: number): Promise<Department | null>;
    saveDepartment(data: Partial<Department>): Promise<Department>;
    deleteDepartment(id: number): Promise<boolean>;
    restoreDepartment(id: number): Promise<Department | null>;
}

export class DepartmentRepository implements IDepartmentRepository {
    
    async findDepartmentById(id: number): Promise<Department | null> {
        return departmentRepository.findOne({ 
            where: { id }, 
            withDeleted: true,
            relations: ["manager"] 
        });
    }

    async saveDepartment(data: Partial<Department>): Promise<Department> {
        const department = departmentRepository.create(data);
        return await departmentRepository.save(department);
    }

    async deleteDepartment(id: number): Promise<boolean> {
        const department = await departmentRepository.findOne({ where: { id } });
        if (!department) return false;
        
        await departmentRepository.softRemove(department);
        return true;
    }

    async findAllDepartments(activeOnly: boolean = false): Promise<Department[]> {
        return await departmentRepository.find({ 
            withDeleted: !activeOnly,
            relations: ["manager"] 
        });
    }

    async restoreDepartment(id: number): Promise<Department | null> {
        const department = await departmentRepository.findOne({
            where: { id },
            withDeleted: true,
            relations: ["manager"],
        });

        if (!department || !department.deleted_at) return null;

        await departmentRepository.recover(department);
        return department;
    }
}