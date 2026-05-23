import { Router } from "express";
import { z } from "zod";
import { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, restoreUser } from "../controllers/user.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { getUserLogs } from "../controllers/system-log.controller";
import { createRoute } from "../utils/route-builder";
import {
    CreateUserBodySchema,
    UpdateUserBodySchema,
    ChangePasswordBodySchema,
    DeleteUserBodySchema,
    RestoreUserBodySchema,
    UserResponseSchema,
    userIdParamsSchema,
    getUsersQuerySchema
} from "../dtos/user.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.USERS.CREATE,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Create a new user",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateUserBodySchema } } }
    },
    responses: {
        201: {
            description: "Created user",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        400: { description: "Validation or request error" },
        409: { description: "Username or email already exists" }
    }
}, createUser);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.USERS.GET_ALL,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "List users",
    request: {
        query: getUsersQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "List of users",
            content: { [ContentType.JSON]: { schema: z.array(UserResponseSchema) } }
        }
    },
}, getUsers);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.USERS.GET_BY_ID,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Get a user by ID",
    request: {
        params: userIdParamsSchema.shape.params
    },
    responses: {
        200: {
            description: "User details",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        404: { description: "User not found" }
    }
}, getUserById);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.USERS.GET_LOGS,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Get logs for a user",
    request: {
        params: userIdParamsSchema.shape.params
    },
    responses: {
        200: { description: "List of user logs" }
    }
}, getUserLogs);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.USERS.CHANGE_PASSWORD,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Change user password",
    request: {
        params: userIdParamsSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: ChangePasswordBodySchema } } }
    },
    responses: {
        200: {
            description: "Password changed successfully",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        404: { description: "User not found" }
    }
}, changePassword);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.USERS.UPDATE,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Update user details",
    request: {
        params: userIdParamsSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateUserBodySchema } } }
    },
    responses: {
        200: {
            description: "Updated user",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        404: { description: "User not found" },
        409: { description: "Username or email already exists" }
    }
}, updateUser);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.USERS.DELETE,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Delete a user",
    request: {
        params: userIdParamsSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: DeleteUserBodySchema } } }
    },
    responses: {
        204: { description: "User deleted successfully" },
        404: { description: "User not found" }
    }
}, deleteUser);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.USERS.RESTORE,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Restore a deleted user",
    request: {
        params: userIdParamsSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: RestoreUserBodySchema } } }
    },
    responses: {
        200: {
            description: "User restored successfully",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        400: { description: "User is not deleted" },
        404: { description: "User not found" }
    }
}, restoreUser);

export default router;
