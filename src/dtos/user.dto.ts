import { z, registry } from "../infra/config/openapi";

// ============ Reusable Schemas ============

export const userIdParamsSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

// ============ Auth Schemas ============

const LoginBodySchema = registry.register(
    "LoginRequestDto",
    z.object({
        email: z.email("Invalid email format").openapi({ example: "user@email.com" }),
        password: z.string().min(1, "Password is required").openapi({ example: "password123" }),
    })
);

export const loginSchema = z.object({ body: LoginBodySchema });
export type LoginRequestDto = z.infer<typeof loginSchema>["body"];

const ForgotPasswordBodySchema = registry.register(
    "ForgotPasswordRequestDto",
    z.object({
        email: z.email("Invalid email format").openapi({ example: "user@email.com" }),
    })
);

export const forgotPasswordSchema = z.object({ body: ForgotPasswordBodySchema });
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordSchema>["body"];

const ResetPasswordBodySchema = registry.register(
    "ResetPasswordRequestDto",
    z.object({
        token: z.string().min(1, "Token is required").openapi({ example: "token123" }),
        password: z.string().min(1, "Password is required").openapi({ example: "newpassword123" }),
    })
);
export const resetPasswordSchema = z.object({ body: ResetPasswordBodySchema });
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordSchema>["body"];

const DefinePasswordBodySchema = registry.register(
    "DefinePasswordRequestDto",
    z.object({
        password: z.string().min(1, "Password is required").openapi({ example: "newpassword123" }),
    })
);
export const definePasswordSchema = z.object({ body: DefinePasswordBodySchema });
export type DefinePasswordRequestDto = z.infer<typeof definePasswordSchema>["body"];

// ============ User Schemas ============

const CreateUserBodySchema = registry.register(
    "CreateUserRequestDto",
    z.object({
        name: z.string().min(1, "Name is required").openapi({ example: "John Doe" }),
        phone: z.string().optional().openapi({ example: "+1234567890" }),
        cpf: z.string().optional().openapi({ example: "123.456.789-00" }),
        email: z.email("Invalid email format").openapi({ example: "john@terrano.com" }),
        username: z.string().min(1, "Username is required").openapi({ example: "johndoe" }),
        password: z.string().min(1, "Password is required").openapi({ example: "password123" }),
        roleId: z.number().int().positive("Role ID is required").openapi({ example: 1 }),
        departmentId: z.number().int().positive("Department ID is required").openapi({ example: 1 }),
        requiresPasswordReset: z.boolean().optional().openapi({ example: false }),
        updatedBy: z.number().int().positive().optional().openapi({ example: 1 }),
    })
);

export const createUserSchema = z.object({ body: CreateUserBodySchema });
export type CreateUserRequestDto = z.infer<typeof createUserSchema>["body"];

const UpdateUserBodySchema = registry.register(
    "UpdateUserRequestDto",
    z.object({
        name: z.string().min(1, "Name cannot be empty").optional().openapi({ example: "John Doe" }),
        phone: z.string().optional().openapi({ example: "+1234567890" }),
        cpf: z.string().nullable().optional().openapi({ example: "123.456.789-00" }),
        email: z.email("Invalid email format").optional().openapi({ example: "john@terrano.com" }),
        username: z.string().min(1, "Username cannot be empty").optional().openapi({ example: "johndoe" }),
        roleId: z.number().int().positive().optional().openapi({ example: 1 }),
        departmentId: z.number().int().positive().optional().openapi({ example: 1 }),
        updatedBy: z.number().int().positive().optional().openapi({ example: 1 }),
    })
);

export const updateUserSchema = z.object({
    params: userIdParamsSchema.shape.params,
    body: UpdateUserBodySchema,
});
export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>["body"];

const ChangePasswordBodySchema = registry.register(
    "ChangePasswordRequestDto",
    z.object({
        password: z.string().min(1, "Password is required").openapi({ example: "password123" }),
        updatedBy: z.number().int().positive().optional().openapi({ example: 1 }),
    })
);

export const changePasswordSchema = z.object({
    params: userIdParamsSchema.shape.params,
    body: ChangePasswordBodySchema,
});
export type ChangePasswordRequestDto = z.infer<typeof changePasswordSchema>["body"];

const DeleteUserBodySchema = registry.register(
    "DeleteUserRequestDto",
    z.object({
        updatedBy: z.number().int().positive().optional().openapi({ example: 1 }),
    }).optional()
);

export const deleteUserSchema = z.object({
    params: userIdParamsSchema.shape.params,
    body: DeleteUserBodySchema,
});
export type DeleteUserRequestDto = z.infer<typeof deleteUserSchema>["body"];

export const getUsersQuerySchema = z.object({
    query: z.object({
        name: z.string().optional(),
        onlyActive: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    }).default({})
});
export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>["query"];

const RestoreUserBodySchema = registry.register(
    "RestoreUserRequestDto",
    z.object({
        updatedBy: z.number().int().positive().optional(),
    }).optional()
);

export const restoreUserSchema = z.object({
    params: userIdParamsSchema.shape.params,
    body: RestoreUserBodySchema,
});

// ============ Response Schemas ============

const RoleResponseSchema = registry.register(
    "RoleDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Admin" }),
    })
);

const DepartmentResponseSchema = registry.register(
    "DepartmentDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "IT" }),
    })
);

const UserResponseSchema = registry.register(
    "UserResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "John Doe" }),
        phone: z.string().optional().openapi({ example: "+1234567890" }),
        cpf: z.string().optional().openapi({ example: "123.456.789-00" }),
        email: z.string().openapi({ example: "john@terrano.com" }),
        username: z.string().openapi({ example: "johndoe" }),
        role: RoleResponseSchema.optional().openapi({ example: { id: 1, name: "Admin" } }),
        department: DepartmentResponseSchema.optional().openapi({ example: { id: 1, name: "IT" } }),
        managedDepartments: z.array(DepartmentResponseSchema).openapi({ example: [{ id: 1, name: "IT" }] }),
        isActive: z.boolean().openapi({ example: true }),
        requiresPasswordReset: z.boolean().optional().openapi({ example: false }),
    })
);

const LoginResponseSchema = registry.register(
    "LoginResponseDto",
    z.object({
        token: z.string().openapi({ example: "token123" }),
        expiresAt: z.string().openapi({ example: "2022-01-01T00:00:00.000Z" }),
        mustResetPassword: z.boolean().optional().openapi({ example: false }),
    })
);

// ============ Auth Route Registrations ============

registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    tags: ["Auth"],
    summary: "Log in with email and password",
    request: {
        body: {
            content: { "application/json": { schema: LoginBodySchema } }
        }
    },
    responses: {
        200: {
            description: "Login response with bearer token",
            content: { "application/json": { schema: LoginResponseSchema } }
        },
        401: { description: "Invalid credentials" }
    }
});

registry.registerPath({
    method: "post",
    path: "/api/auth/forgot-password",
    tags: ["Auth"],
    summary: "Request a password reset link",
    request: {
        body: {
            content: { "application/json": { schema: ForgotPasswordBodySchema } }
        }
    },
    responses: {
        200: { description: "Password reset email queued or logged" }
    }
});

registry.registerPath({
    method: "post",
    path: "/api/auth/reset-password",
    tags: ["Auth"],
    summary: "Reset password using token from email",
    request: {
        body: {
            content: { "application/json": { schema: ResetPasswordBodySchema } }
        }
    },
    responses: {
        200: { description: "Password reset successfully" },
        400: { description: "Invalid or expired reset token" }
    }
});

registry.registerPath({
    method: "post",
    path: "/api/auth/define-password",
    tags: ["Auth"],
    summary: "Define or change password for the logged in user",
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: { "application/json": { schema: DefinePasswordBodySchema } }
        }
    },
    responses: {
        200: { description: "Password updated successfully" },
        401: { description: "Unauthorized" }
    }
});

// ============ User Route Registrations ============

registry.registerPath({
    method: "post",
    path: "/api/users",
    tags: ["Users"],
    summary: "Create a new user",
    request: {
        body: {
            content: { "application/json": { schema: CreateUserBodySchema } }
        }
    },
    responses: {
        201: {
            description: "Created user",
            content: { "application/json": { schema: UserResponseSchema } }
        },
        400: { description: "Validation or request error" },
        409: { description: "Username or email already exists" }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/users",
    tags: ["Users"],
    summary: "List users",
    request: {
        query: z.object({
            name: z.string().optional(),
            onlyActive: z.string().optional(),
        })
    },
    responses: {
        200: {
            description: "List of users",
            content: { "application/json": { schema: z.array(UserResponseSchema) } }
        }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/users/{id}",
    tags: ["Users"],
    summary: "Get a user by ID",
    request: {
        params: userIdParamsSchema.shape.params
    },
    responses: {
        200: {
            description: "User details",
            content: { "application/json": { schema: UserResponseSchema } }
        },
        404: { description: "User not found" }
    }
});

registry.registerPath({
    method: "put",
    path: "/api/users/{id}/password",
    tags: ["Users"],
    summary: "Change user password",
    request: {
        params: userIdParamsSchema.shape.params,
        body: {
            content: { "application/json": { schema: ChangePasswordBodySchema } }
        }
    },
    responses: {
        200: {
            description: "Password changed successfully",
            content: { "application/json": { schema: UserResponseSchema } }
        },
        404: { description: "User not found" }
    }
});

registry.registerPath({
    method: "put",
    path: "/api/users/{id}",
    tags: ["Users"],
    summary: "Update user details",
    request: {
        params: userIdParamsSchema.shape.params,
        body: {
            content: { "application/json": { schema: UpdateUserBodySchema } }
        }
    },
    responses: {
        200: {
            description: "Updated user",
            content: { "application/json": { schema: UserResponseSchema } }
        },
        404: { description: "User not found" },
        409: { description: "Username or email already exists" }
    }
});

registry.registerPath({
    method: "delete",
    path: "/api/users/{id}",
    tags: ["Users"],
    summary: "Delete a user",
    request: {
        params: userIdParamsSchema.shape.params,
        body: {
            content: { "application/json": { schema: DeleteUserBodySchema } }
        }
    },
    responses: {
        204: { description: "User deleted successfully" },
        404: { description: "User not found" }
    }
});

registry.registerPath({
    method: "post",
    path: "/api/users/{id}/restore",
    tags: ["Users"],
    summary: "Restore a deleted user",
    request: {
        params: userIdParamsSchema.shape.params,
        body: {
            content: { "application/json": { schema: RestoreUserBodySchema } }
        }
    },
    responses: {
        200: {
            description: "User restored successfully",
            content: { "application/json": { schema: UserResponseSchema } }
        },
        400: { description: "User is not deleted" },
        404: { description: "User not found" }
    }
});

// ============ Classes for Runtime ============

export class RoleDto {
    id!: number;
    name!: string;
}

export class DepartmentDto {
    id!: number;
    name!: string;
}

export class UserResponseDto {
    id!: number;
    name!: string;
    phone?: string;
    cpf?: string;
    email!: string;
    username!: string;
    role?: RoleDto;
    department?: DepartmentDto;
    managedDepartments: DepartmentDto[] = [];
    isActive!: boolean;
    requiresPasswordReset?: boolean;
}

export class LoginResponseDto {
    token!: string;
    expiresAt!: string;
    mustResetPassword?: boolean;
}
