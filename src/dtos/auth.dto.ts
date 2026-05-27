import { User } from "../infra/entities/user.entity";
import { z, registry } from "../infra/config/openapi";
import { RoleResponseSchema, DepartmentResponseSchema } from "./user.dto";

// ============ Auth Schemas ============

export const LoginBodySchema = registry.register(
    "LoginBody",
    z.object({
        email: z.email("Invalid email format").openapi({ example: "user@email.com" }),
        password: z.string().min(1, "Password is required").openapi({ example: "password123" }),
    })
);

export const loginSchema = z.object({ body: LoginBodySchema });
export type LoginBody = z.infer<typeof loginSchema>["body"];

export const ForgotPasswordBodySchema = registry.register(
    "ForgotPasswordBody",
    z.object({
        email: z.email("Invalid email format").openapi({ example: "user@email.com" }),
    })
);

export const forgotPasswordSchema = z.object({ body: ForgotPasswordBodySchema });
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>["body"];

export const ResetPasswordBodySchema = registry.register(
    "ResetPasswordBody",
    z.object({
        token: z.string().min(1, "Token is required").openapi({ example: "token123" }),
        password: z.string().min(1, "Password is required").openapi({ example: "newpassword123" }),
    })
);
export const resetPasswordSchema = z.object({ body: ResetPasswordBodySchema });
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>["body"];

export const DefinePasswordBodySchema = registry.register(
    "DefinePasswordBody",
    z.object({
        password: z.string().min(1, "Password is required").openapi({ example: "newpassword123" }),
    })
);
export const definePasswordSchema = z.object({ body: DefinePasswordBodySchema });
export type DefinePasswordBody = z.infer<typeof definePasswordSchema>["body"];

// ============ Response Schemas ============

export const LoginResponseSchema = registry.register(
    "LoginResponse",
    z.object({
        token: z.string().openapi({ example: "token123" }),
        expiresAt: z.string().openapi({ example: "2022-01-01T00:00:00.000Z" }),
        mustResetPassword: z.boolean().optional().openapi({ example: false }),
    })
);

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const MeResponseSchema = registry.register(
    "MeResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "John Doe" }),
        phone: z.string().optional().openapi({ example: "+1234567890" }),
        cpf: z.string().optional().openapi({ example: "123.456.789-00" }),
        email: z.string().openapi({ example: "john@terrano.com" }),
        username: z.string().openapi({ example: "johndoe" }),
        role: RoleResponseSchema.optional(),
        department: DepartmentResponseSchema.optional(),
        isActive: z.boolean().openapi({ example: true }),
        requiresPasswordReset: z.boolean().optional().openapi({ example: false }),
    })
);

export type MeResponse = z.infer<typeof MeResponseSchema>;

export function toMeResponse(user: User): MeResponse {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        email: user.email,
        username: user.username,
        role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
        department: user.department ? { id: user.department.id, name: user.department.name } : undefined,
        isActive: user.is_active ?? true,
        requiresPasswordReset: user.requires_password_reset,
    };
}
