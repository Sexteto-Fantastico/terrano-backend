import { Router } from "express";
import { z } from "zod";
import { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, restoreUser, uploadProfilePicture, getMyPermissions } from "../controllers/user.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { getUserLogs } from "../controllers/system-log.controller";
import { createRoute } from "../utils/route-builder";
import { uploadAvatar } from "../middlewares/upload.middleware";
import {
    CreateUserBodySchema,
    UpdateUserBodySchema,
    ChangePasswordBodySchema,
    DeleteUserBodySchema,
    RestoreUserBodySchema,
    UserResponseSchema,
    UserIdParamsSchema,
    UserQuerySchema,
    UserPermissionsSchema
} from "../dtos/user.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.USERS.GET_MY_PERMISSIONS,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Get permissions of the authenticated user",
    responses: {
        200: {
            description: "User permissions",
            content: { [ContentType.JSON]: { schema: UserPermissionsSchema } }
        },
        404: { description: "User or role not found" }
    },
}, getMyPermissions);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.USERS.CREATE,
    permissions: { resource: "USER", action: "CREATE" },
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
        query: UserQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "List of users",
            content: { [ContentType.JSON]: { schema: z.array(UserResponseSchema) } }
        }
    },
    permissions: { resource: "USER", action: "READ" },
}, getUsers);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.USERS.GET_BY_ID,
    permissions: { resource: "USER", action: "READ" },
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Get a user by ID",
    request: {
        params: UserIdParamsSchema.shape.params
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
        params: UserIdParamsSchema.shape.params
    },
    responses: {
        200: { description: "List of user logs" }
    },
    permissions: { resource: "USER", action: "READ" },
}, getUserLogs);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.USERS.CHANGE_PASSWORD,
    permissions: { resource: "USER", action: "UPDATE" },
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Change user password",
    request: {
        params: UserIdParamsSchema.shape.params,
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
        params: UserIdParamsSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateUserBodySchema } } }
    },
    responses: {
        200: {
            description: "Updated user",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        404: { description: "User not found" },
        409: { description: "Username or email already exists" }
    },
    permissions: { resource: "USER", action: "UPDATE" },
}, updateUser);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.USERS.DELETE,
    permissions: { resource: "USER", action: "DELETE" },
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Delete a user",
    request: {
        params: UserIdParamsSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: DeleteUserBodySchema } } }
    },
    responses: {
        204: { description: "User deleted successfully" },
        404: { description: "User not found" }
    }
}, deleteUser);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.USERS.RESTORE,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Restore a deleted user",
    request: {
        params: UserIdParamsSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: RestoreUserBodySchema } } }
    },
    responses: {
        200: {
            description: "User restored successfully",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        400: { description: "User is not deleted" },
        404: { description: "User not found" }
    },
    permissions: { resource: "USER", action: "UPDATE" },
}, restoreUser);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.USERS.UPLOAD_AVATAR,
    basePath: Endpoints.USERS.BASE,
    tags: ["Users"],
    summary: "Upload user profile picture",
    request: {
        params: UserIdParamsSchema.shape.params
    },
    responses: {
        200: {
            description: "Profile picture uploaded successfully",
            content: { [ContentType.JSON]: { schema: UserResponseSchema } }
        },
        400: { description: "No file provided or invalid file type" },
        404: { description: "User not found" }
    },
    middlewares: [uploadAvatar.single("avatar")]
}, uploadProfilePicture);

export default router;
