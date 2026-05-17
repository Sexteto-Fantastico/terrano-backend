import { z, registry } from "../infra/config/openapi";

// ============ Reusable Schemas ============

export const userIdParamsSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

// ============ Auth Schemas ============

export const LoginBodySchema = registry.register(
    "LoginRequestDto",
    z.object({
        email: z.email("Invalid email format").openapi({ example: "user@email.com" }),
        password: z.string().min(1, "Password is required").openapi({ example: "password123" }),
    })
);

export const loginSchema = z.object({ body: LoginBodySchema });
export type LoginRequestDto = z.infer<typeof loginSchema>["body"];

export const ForgotPasswordBodySchema = registry.register(
    "ForgotPasswordRequestDto",
    z.object({
        email: z.email("Invalid email format").openapi({ example: "user@email.com" }),
    })
);

export const forgotPasswordSchema = z.object({ body: ForgotPasswordBodySchema });
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordSchema>["body"];

export const ResetPasswordBodySchema = registry.register(
    "ResetPasswordRequestDto",
    z.object({
        token: z.string().min(1, "Token is required").openapi({ example: "token123" }),
        password: z.string().min(1, "Password is required").openapi({ example: "newpassword123" }),
    })
);
export const resetPasswordSchema = z.object({ body: ResetPasswordBodySchema });
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordSchema>["body"];

export const DefinePasswordBodySchema = registry.register(
    "DefinePasswordRequestDto",
    z.object({
        password: z.string().min(1, "Password is required").openapi({ example: "newpassword123" }),
    })
);
export const definePasswordSchema = z.object({ body: DefinePasswordBodySchema });
export type DefinePasswordRequestDto = z.infer<typeof definePasswordSchema>["body"];

// ============ User Schemas ============

export const CreateUserBodySchema = registry.register(
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

export const UpdateUserBodySchema = registry.register(
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

export const ChangePasswordBodySchema = registry.register(
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

export const DeleteUserBodySchema = registry.register(
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
    })
});
export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>["query"];

export const RestoreUserBodySchema = registry.register(
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

export const RoleResponseSchema = registry.register(
    "RoleDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Admin" }),
    })
);

export const DepartmentResponseSchema = registry.register(
    "DepartmentDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "IT" }),
    })
);

export const UserResponseSchema = registry.register(
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

export const LoginResponseSchema = registry.register(
    "LoginResponseDto",
    z.object({
        token: z.string().openapi({ example: "token123" }),
        expiresAt: z.string().openapi({ example: "2022-01-01T00:00:00.000Z" }),
        mustResetPassword: z.boolean().optional().openapi({ example: false }),
    })
);

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
