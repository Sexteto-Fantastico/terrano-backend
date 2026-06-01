import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";
import { UserResponseSchema, toUserResponse } from "./user.dto";
import { Department } from "../infra/entities/department.entity";

export const DepartmentIdSchema = idParamSchema;

export const DepartmentQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});
export type DepartmentQuery = z.infer<typeof DepartmentQuerySchema>["query"];

export const CreateDepartmentBodySchema = registry.register(
    "CreateDepartment",
    z.object({
        name: z.string().min(1, "Department name is required").openapi({ example: "Engineering" }),
        managerId: z.number().int().positive("Manager ID is required").openapi({ example: 1 }),
    })
);

export const createDepartmentSchema = z.object({ body: CreateDepartmentBodySchema });
export type CreateDepartment = z.infer<typeof createDepartmentSchema>["body"];

export const UpdateDepartmentBodySchema = registry.register(
    "UpdateDepartment",
    z.object({
        name: z.string().min(1, "Department name cannot be empty").optional().openapi({ example: "Engineering v2" }),
        managerId: z.number().int().positive().optional().openapi({ example: 2 }),
    })
);

export const updateDepartmentSchema = z.object({
    params: DepartmentIdSchema.shape.params,
    body: UpdateDepartmentBodySchema,
});
export type UpdateDepartment = z.infer<typeof updateDepartmentSchema>["body"];

export const DepartmentResponseSchema = registry.register(
    "DepartmentResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Engineering" }),
        manager: UserResponseSchema.optional(),
        isActive: z.boolean().openapi({ example: true }),
        createdAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
        updatedAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
        deletedAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
    })
);

export type DepartmentResponse = z.infer<typeof DepartmentResponseSchema>;

export const toDepartmentResponse = (dept: Department): DepartmentResponse => ({
    id: dept.id,
    name: dept.name,
    manager: dept.manager ? toUserResponse(dept.manager) : undefined,
    isActive: !dept.deleted_at,
    createdAt: dept.created_at,
    updatedAt: dept.updated_at,
    deletedAt: dept.deleted_at,
});

export const toDepartmentResponseList = (list: Department[]): DepartmentResponse[] =>
    list.map(toDepartmentResponse);