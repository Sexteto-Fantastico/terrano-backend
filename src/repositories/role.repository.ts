import { FindOptionsWhere, FindManyOptions, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { Role } from "../infra/entities/role.entity";
import { Policy } from "../infra/entities/policy.entity";
import { RoleQuery } from "../dtos/role.dto";

const roleRepository = AppDataSource.getRepository(Role);

async function getRoleById(id: number): Promise<Role | null> {
    return await roleRepository.findOne({ where: { id } });
}

async function getRoleWithPolicies(id: number): Promise<Role | null> {
    return await roleRepository.findOne({
        where: { id },
        relations: ["policies"],
    });
}

async function getRoleByName(name: string): Promise<Role | null> {
    return await roleRepository.findOne({ where: { name }, withDeleted: true });
}

async function getAllRoles(filters: RoleQuery = {}): Promise<[Role[], number]> {
    const { activeOnly = true, pageIndex, pageSize, sortBy, sortOrder } = filters;

    const where: FindOptionsWhere<Role> = {};

    if (filters.name) {
        where.name = ILike(`%${filters.name}%`);
    }

    const options: FindManyOptions<Role> = {
        where,
        withDeleted: !activeOnly,
        relations: ["policies"],
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return await roleRepository.findAndCount(options);
    }

    const results = await roleRepository.find(options);
    return [results, results.length];
}

async function createRole(role: Role): Promise<Role> {
    return await roleRepository.save(role);
}

async function updateRole(role: Role): Promise<Role> {
    return await roleRepository.save(role);
}

async function deleteRole(role: Role): Promise<Role> {
    return await roleRepository.softRemove(role);
}

async function recoverRole(role: Role): Promise<Role> {
    return await roleRepository.recover(role);
}

async function assignPoliciesToRole(role: Role, policies: Policy[]): Promise<Role> {
    role.policies = policies;
    return await roleRepository.save(role);
}

export {
    getRoleById,
    getRoleWithPolicies,
    getRoleByName,
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    recoverRole,
    assignPoliciesToRole,
};
