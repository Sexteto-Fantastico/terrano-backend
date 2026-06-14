import { Role } from "../infra/entities/role.entity";
import { Policy } from "../infra/entities/policy.entity";
import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";

export const RoleIdSchema = idParamSchema;

export const RoleQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});
export type RoleQuery = z.infer<typeof RoleQuerySchema>["query"];

export const CreateRoleBodySchema = registry.register(
    "CreateRoleBody",
    z.object({
        name: z.string().min(1, "Role name is required").openapi({ example: "MANAGER" }),
        description: z.string().optional().openapi({ example: "Manager role" }),
        policyIds: z.array(z.number().int().positive()).min(1).optional().openapi({ example: [1, 2, 3] }),
    })
);

export type CreateRoleBody = z.infer<typeof CreateRoleBodySchema>;

export const UpdateRoleBodySchema = registry.register(
    "UpdateRoleBody",
    z.object({
        name: z.string().min(1, "Role name cannot be empty").optional().openapi({ example: "MANAGER" }),
        description: z.string().optional().openapi({ example: "Manager role" }),
    })
);

export type UpdateRoleBody = z.infer<typeof UpdateRoleBodySchema>;

export const AssignPoliciesBodySchema = registry.register(
    "AssignPoliciesBody",
    z.object({
        policyIds: z.array(z.number().int().positive()).min(1, "At least one policy is required").openapi({ example: [1, 2, 3] }),
    })
);

export type AssignPoliciesBody = z.infer<typeof AssignPoliciesBodySchema>;

export const PolicyResponseSchema = registry.register(
    "PolicyResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "PRODUCT_CREATE" }),
        description: z.string().optional().openapi({ example: "Criar produtos" }),
        resource: z.string().openapi({ example: "PRODUCT" }),
        module: z.string().openapi({ example: "REGISTERS" }),
        action: z.string().openapi({ example: "CREATE" }),
    })
);

export type PolicyResponse = z.infer<typeof PolicyResponseSchema>;

export const RoleDetailResponseSchema = registry.register(
    "RoleDetail",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "ADMIN" }),
        description: z.string().optional().openapi({ example: "Administrador" }),
        policies: z.array(PolicyResponseSchema).openapi({ example: [] }),
        isActive: z.boolean().openapi({ example: true }),
    })
);

export type RoleResponse = z.infer<typeof RoleDetailResponseSchema>;

export const toPolicyResponse = (policy: Policy): PolicyResponse => ({
    id: policy.id,
    name: policy.name,
    description: policy.description,
    resource: policy.resource,
    module: policy.module,
    action: policy.action,
});

export const toPolicyResponseList = (policies: Policy[]): PolicyResponse[] =>
    policies.map(toPolicyResponse);

export const toRoleResponse = (role: Role): RoleResponse => ({
    id: role.id,
    name: role.name,
    description: role.description,
    policies: role.policies ? toPolicyResponseList(role.policies) : [],
    isActive: !role.deleted_at,
});

export const toRoleResponseList = (roles: Role[]): RoleResponse[] =>
    roles.map(toRoleResponse);
