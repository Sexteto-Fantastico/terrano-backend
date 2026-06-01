import { User } from "../infra/entities/user.entity";
import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";

// ============ Reusable Schemas ============

export const UserIdParamsSchema = idParamSchema;

// ============ User Schemas ============

export const CreateUserBodySchema = registry.register(
    "CreateUserBody",
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
export type CreateUserBody = z.infer<typeof createUserSchema>["body"];

export const UpdateUserBodySchema = registry.register(
    "UpdateUserBody",
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
    params: UserIdParamsSchema.shape.params,
    body: UpdateUserBodySchema,
});
export type UpdateUserBody = z.infer<typeof updateUserSchema>["body"];

export const ChangePasswordBodySchema = registry.register(
    "ChangePasswordBody",
    z.object({
        password: z.string().min(1, "Password is required").openapi({ example: "password123" }),
        updatedBy: z.number().int().positive().optional().openapi({ example: 1 }),
    })
);

export const changePasswordSchema = z.object({
    params: UserIdParamsSchema.shape.params,
    body: ChangePasswordBodySchema,
});
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>["body"];

export const DeleteUserBodySchema = registry.register(
    "DeleteUserBody",
    z.object({
        updatedBy: z.number().int().positive().optional().openapi({ example: 1 }),
    }).optional()
);

export const deleteUserSchema = z.object({
    params: UserIdParamsSchema.shape.params,
    body: DeleteUserBodySchema,
});
export type DeleteUserBody = z.infer<typeof deleteUserSchema>["body"];

export const UserQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        cpf: z.string().optional(),
        departmentId: z.coerce.number().int().positive().optional(),
        activeOnly: activeOnlyField,
    })
});
export type UserQuery = z.infer<typeof UserQuerySchema>["query"];

export const RestoreUserBodySchema = registry.register(
    "RestoreUserBody",
    z.object({
        updatedBy: z.number().int().positive().optional(),
    }).optional()
);

export const restoreUserSchema = z.object({
    params: UserIdParamsSchema.shape.params,
    body: RestoreUserBodySchema,
});

// ============ Response Schemas ============

export const RoleResponseSchema = registry.register(
    "Role",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Admin" }),
    })
);

export const DepartmentResponseSchema = registry.register(
    "Department",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "IT" }),
    })
);

export const UserResponseSchema = registry.register(
    "UserResponse",
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

// ============ Inferred Types ============

export type Role = z.infer<typeof RoleResponseSchema>;

export type Department = z.infer<typeof DepartmentResponseSchema>;

export type UserResponse = z.infer<typeof UserResponseSchema>;

// ============ Mapper Functions ============

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        email: user.email,
        username: user.username,
        role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
        department: user.department ? { id: user.department.id, name: user.department.name } : undefined,
        managedDepartments: user.managed_departments?.map(d => ({ id: d.id, name: d.name })),
        isActive: !user.deleted_at,
        requiresPasswordReset: user.requires_password_reset,
    };
}

export function toUserResponseList(users: User[]): UserResponse[] {
    return users.map(toUserResponse);
}
