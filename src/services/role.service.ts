import { Role } from "../infra/entities/role.entity";
import {
    CreateRoleBody,
    UpdateRoleBody,
    AssignPoliciesBody,
    RoleResponse,
    toRoleResponse,
    toRoleResponseList,
} from "../dtos/role.dto";
import { BadRequestError, ConflictError, NotFoundError } from "../errors";
import {
    getRoleById,
    getRoleWithPolicies,
    getRoleByName,
    getAllRoles as repoGetAllRoles,
    createRole as repoCreateRole,
    updateRole as repoUpdateRole,
    deleteRole as repoDeleteRole,
    recoverRole as repoRecoverRole,
    assignPoliciesToRole,
} from "../repositories/role.repository";
import { getPoliciesByIds } from "../repositories/policy.repository";

async function createRole(request: CreateRoleBody): Promise<RoleResponse> {
    const existing = await getRoleByName(request.name);
    if (existing) {
        throw new ConflictError("Role name already exists.");
    }

    const role = new Role({
        name: request.name,
        description: request.description,
        policies: [],
    });

    const saved = await repoCreateRole(role);

    if (request.policyIds) {
        const policies = await getPoliciesByIds(request.policyIds);
        if (policies.length !== request.policyIds.length) {
            throw new NotFoundError("One or more policies not found.");
        }
        await assignPoliciesToRole(saved, policies);
    }

    const withPolicies = await getRoleWithPolicies(saved.id);
    return toRoleResponse(withPolicies!);
}

async function getAllRoles(filters: Record<string, unknown>): Promise<{ data: RoleResponse[]; total: number }> {
    const [roles, total] = await repoGetAllRoles(filters);
    return { data: toRoleResponseList(roles), total };
}

async function getRoleByIdService(id: number): Promise<RoleResponse> {
    const role = await getRoleWithPolicies(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    return toRoleResponse(role);
}

async function updateRole(id: number, request: UpdateRoleBody): Promise<RoleResponse> {
    const role = await getRoleById(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }

    if (request.name !== undefined) {
        const existing = await getRoleByName(request.name);
        if (existing && existing.id !== id) {
            throw new ConflictError("Role name already exists.");
        }
        role.name = request.name;
    }

    if (request.description !== undefined) {
        role.description = request.description;
    }

    const updated = await repoUpdateRole(role);
    const withPolicies = await getRoleWithPolicies(updated.id);
    return toRoleResponse(withPolicies!);
}

async function deleteRole(id: number): Promise<void> {
    const role = await getRoleById(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    await repoDeleteRole(role);
}

async function restoreRole(id: number): Promise<RoleResponse> {
    const role = await getRoleById(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    if (!role.deleted_at) {
        throw new BadRequestError("Role is not deleted.");
    }
    const restored = await repoRecoverRole(role);
    const withPolicies = await getRoleWithPolicies(restored.id);
    return toRoleResponse(withPolicies!);
}

async function assignPolicies(id: number, request: AssignPoliciesBody): Promise<RoleResponse> {
    const role = await getRoleWithPolicies(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }

    const policies = await getPoliciesByIds(request.policyIds);
    if (policies.length !== request.policyIds.length) {
        throw new NotFoundError("One or more policies not found.");
    }

    const updated = await assignPoliciesToRole(role, policies);
    const withPolicies = await getRoleWithPolicies(updated.id);
    return toRoleResponse(withPolicies!);
}

export {
    createRole,
    getAllRoles,
    getRoleByIdService as getRoleById,
    updateRole,
    deleteRole,
    restoreRole,
    assignPolicies,
};
