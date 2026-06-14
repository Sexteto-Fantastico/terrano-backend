import { Router } from "express";
import { z } from "zod";
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole, restoreRole, assignPolicies } from "../controllers/role.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    RoleQuerySchema,
    CreateRoleBodySchema,
    UpdateRoleBodySchema,
    AssignPoliciesBodySchema,
    RoleDetailResponseSchema as RoleResponseSchema,
    RoleIdSchema,
} from "../dtos/role.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.ROLES.CREATE,
    basePath: Endpoints.ROLES.BASE,
    tags: ["Roles"],
    summary: "Create a new role",
    permissions: { resource: "USER", action: "CREATE" },
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateRoleBodySchema } } }
    },
    responses: {
        201: {
            description: "The created role",
            content: { [ContentType.JSON]: { schema: RoleResponseSchema } }
        },
        409: { description: "Role name already exists" }
    }
}, createRole);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.ROLES.GET_ALL,
    basePath: Endpoints.ROLES.BASE,
    tags: ["Roles"],
    summary: "List all roles",
    permissions: { resource: "USER", action: "READ" },
    request: {
        query: RoleQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of roles",
            content: { [ContentType.JSON]: { schema: z.array(RoleResponseSchema) } }
        }
    },
}, getAllRoles);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.ROLES.GET_BY_ID,
    basePath: Endpoints.ROLES.BASE,
    tags: ["Roles"],
    summary: "Get a role by id",
    permissions: { resource: "USER", action: "READ" },
    request: {
        params: RoleIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The role with policies",
            content: { [ContentType.JSON]: { schema: RoleResponseSchema } }
        },
        404: { description: "Role not found" }
    }
}, getRoleById);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.ROLES.UPDATE,
    basePath: Endpoints.ROLES.BASE,
    tags: ["Roles"],
    summary: "Update a role",
    permissions: { resource: "USER", action: "UPDATE" },
    request: {
        params: RoleIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateRoleBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated role",
            content: { [ContentType.JSON]: { schema: RoleResponseSchema } }
        },
        404: { description: "Role not found" }
    }
}, updateRole);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.ROLES.DELETE,
    basePath: Endpoints.ROLES.BASE,
    tags: ["Roles"],
    summary: "Delete a role",
    permissions: { resource: "USER", action: "DELETE" },
    request: {
        params: RoleIdSchema.shape.params
    },
    responses: {
        204: { description: "Role deleted successfully" },
        404: { description: "Role not found" }
    }
}, deleteRole);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.ROLES.RESTORE,
    basePath: Endpoints.ROLES.BASE,
    tags: ["Roles"],
    summary: "Restore a deleted role",
    permissions: { resource: "USER", action: "UPDATE" },
    request: {
        params: RoleIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The restored role",
            content: { [ContentType.JSON]: { schema: RoleResponseSchema } }
        },
        400: { description: "Role is not deleted" },
        404: { description: "Role not found" }
    }
}, restoreRole);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.ROLES.ASSIGN_POLICIES,
    basePath: Endpoints.ROLES.BASE,
    tags: ["Roles"],
    summary: "Assign policies to a role",
    permissions: { resource: "USER", action: "UPDATE" },
    request: {
        params: RoleIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: AssignPoliciesBodySchema } } }
    },
    responses: {
        200: {
            description: "The role with updated policies",
            content: { [ContentType.JSON]: { schema: RoleResponseSchema } }
        },
        404: { description: "Role or policies not found" }
    }
}, assignPolicies);

export default router;
