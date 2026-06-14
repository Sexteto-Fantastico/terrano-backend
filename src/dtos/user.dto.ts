import { User } from "../infra/entities/user.entity";
import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";
import { Policy } from "../infra/entities/policy.entity";

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
        roleId: z.coerce.number().int().positive().optional(),
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
        profilePicture: z.string().optional().openapi({ example: "/uploads/profiles/abc123.jpg" }),
        role: RoleResponseSchema.optional().openapi({ example: { id: 1, name: "Admin" } }),
        department: DepartmentResponseSchema.optional().openapi({ example: { id: 1, name: "IT" } }),
        managedDepartments: z.array(DepartmentResponseSchema).openapi({ example: [{ id: 1, name: "IT" }] }),
        isActive: z.boolean().openapi({ example: true }),
        requiresPasswordReset: z.boolean().optional().openapi({ example: false }),
    })
);

export const UserPermissionsSchema = registry.register(
    "UserPermissions",
    z.object({
        registers: z.array(z.object({
            product: z.array(z.string()).openapi({ example: ["create", "read"] }),
            productBrand: z.array(z.string()).openapi({ example: ["read"] }),
            productCategory: z.array(z.string()).openapi({ example: ["read"] }),
            stockLocation: z.array(z.string()).openapi({ example: ["read"] }),
            supplier: z.array(z.string()).openapi({ example: ["read"] }),
            department: z.array(z.string()).openapi({ example: ["read"] }),
            measurementUnit: z.array(z.string()).openapi({ example: ["read"] }),
        })).optional(),
        requests: z.array(z.object({
            materialRequester: z.array(z.string()).openapi({ example: ["create_update", "read" ]}),
            materialRequestsManagement: z.array(z.string()).openapi({ example: ["read"] })
        })).optional(),
        transactions: z.array(z.object({
            purchase: z.array(z.string()).openapi({ example: ["create_update", "read" ]}),
            movementEntry: z.array(z.string()).openapi({ example: ["read"] }),
            movementExit: z.array(z.string()).openapi({ example: ["read"] })
        })).optional(),
        reports: z.array(z.object({
            stockPosition: z.array(z.string()).openapi({ example: ["read"] }),
            productTrace: z.array(z.string()).openapi({ example: ["read"] }),
        })).optional(),
        accessControl: z.array(z.object({
            user: z.array(z.string()).openapi({ example: ["create_update", "read" ]})
        })).optional(),
        notifications: z.array(z.object({
            alert: z.array(z.string()).openapi({ example: ["create_update", "read" ]})
        })).optional(),
        logs: z.array(z.object({
            tableLogs: z.array(z.string()).openapi({ example: ["read"] })
        })).optional(),
    })
);

// ============ Inferred Types ============

export type Role = z.infer<typeof RoleResponseSchema>;

export type Department = z.infer<typeof DepartmentResponseSchema>;

export type UserResponse = z.infer<typeof UserResponseSchema>;

export type UserPermissionsResponse = z.infer<typeof UserPermissionsSchema>;

type Action = "CREATE" | "READ" | "UPDATE" | "DELETE";

// ============ Mapper Functions ============

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        email: user.email,
        username: user.username,
        profilePicture: user.profile_picture,
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


function actionsOf(policies: Policy[], resource: string): string[] {
    return policies
        .filter(p => p.resource === resource)
        .map(p => p.action);
}

export function toUserPermissionsResponse(policies: Policy[]): UserPermissionsResponse {
    const a = (resource: string) => actionsOf(policies, resource);

    return {
        registers: [{
            product:         a("PRODUCT"),
            productBrand:    a("PRODUCT_BRAND"),
            productCategory: a("PRODUCT_CATEGORY"),
            stockLocation:   a("STOCK_LOCATION"),
            supplier:        a("SUPPLIER"),
            department:      a("DEPARTMENT"),
            measurementUnit: a("MEASUREMENT_UNIT"),
        }],
        requests: [{
            materialRequester:          a("MATERIAL_REQUESTER"),
            materialRequestsManagement: a("MATERIAL_REQUESTS_MANAGEMENT"),
        }],
        transactions: [{
            purchase:      a("PURCHASE"),
            movementEntry: a("MOVEMENT_ENTRY"),
            movementExit:  a("MOVEMENT_EXIT"),
        }],
        reports: [{
            stockPosition: a("STOCK_POSITION"),
            productTrace:  a("PRODUCT_TRACE"),
        }],
        accessControl: [{
            user: a("USER"),
        }],
        notifications: [{
            alert: a("ALERT"),
        }],
        logs: [{
            tableLogs: a("TABLE_LOGS"),
        }],
    };
}
