import { Role } from "../infra/entities/role.entity";
import {
    CreateRoleBody,
    UpdateRoleBody,
    AssignPoliciesBody,
    RoleResponse,
    toRoleResponse,
    toRoleResponseList,
} from "../dtos/role.dto";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../errors";
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
import { getUserWithPermissions } from "../repositories/user.repository";
import { Policy } from "../infra/entities/policy.entity";

const ADMIN_ROLE_NAME = "ADMIN";

async function getActor(actorId: number) {
    const actor = await getUserWithPermissions(actorId);
    if (!actor?.role) {
        throw new ForbiddenError("User not authenticated.");
    }
    return actor;
}

// Nobody can grant a permission they do not hold, nor edit the role they are currently using.
async function assertCanGrant(actorId: number, policies: Policy[], targetRoleId?: number): Promise<void> {
    const actor = await getActor(actorId);

    if (targetRoleId !== undefined && actor.role.id === targetRoleId) {
        throw new ForbiddenError("You cannot change the permissions of your own role.");
    }

    const ownPolicyIds = new Set(actor.role.policies.map((policy) => policy.id));
    if (policies.some((policy) => !ownPolicyIds.has(policy.id))) {
        throw new ForbiddenError("You cannot grant permissions that you do not have.");
    }
}

function assertNotProtected(role: Role): void {
    if (role.name === ADMIN_ROLE_NAME) {
        throw new ForbiddenError("The ADMIN role cannot be modified or deleted.");
    }
}

async function createRole(request: CreateRoleBody, actorId: number): Promise<RoleResponse> {
    const existing = await getRoleByName(request.name);
    if (existing) {
        throw new ConflictError("Role name already exists.");
    }

    const requestedPolicies = request.policyIds ? await getPoliciesByIds(request.policyIds) : [];
    if (request.policyIds && requestedPolicies.length !== request.policyIds.length) {
        throw new NotFoundError("One or more policies not found.");
    }
    await assertCanGrant(actorId, requestedPolicies);

    const role = new Role({
        name: request.name,
        description: request.description,
        policies: [],
    });

    const saved = await repoCreateRole(role);

    if (request.policyIds) {
        await assignPoliciesToRole(saved, requestedPolicies);
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

async function updateRole(id: number, request: UpdateRoleBody, actorId: number): Promise<RoleResponse> {
    const role = await getRoleById(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    assertNotProtected(role);
    await assertCanGrant(actorId, [], id);

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

async function deleteRole(id: number, actorId: number): Promise<void> {
    const role = await getRoleById(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    assertNotProtected(role);
    await assertCanGrant(actorId, [], id);
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

async function assignPolicies(id: number, request: AssignPoliciesBody, actorId: number): Promise<RoleResponse> {
    const role = await getRoleWithPolicies(id);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    assertNotProtected(role);

    const policies = await getPoliciesByIds(request.policyIds);
    if (policies.length !== request.policyIds.length) {
        throw new NotFoundError("One or more policies not found.");
    }
    await assertCanGrant(actorId, policies, id);

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
