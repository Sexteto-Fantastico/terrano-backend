import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";

export const departmentIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const departmentQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    })
});
export type DepartmentQueryDto = z.infer<typeof departmentQuerySchema>["query"];

export const CreateDepartmentBodySchema = registry.register(
    "CreateDepartmentDto",
    z.object({
        name: z.string().min(1, "Department name is required").openapi({ example: "Engineering" }),
        managerId: z.number().int().positive("Manager ID is required").openapi({ example: 1 }),
        isActive: z.boolean().optional().openapi({ example: false }),
    })
);

export const createDepartmentSchema = z.object({ body: CreateDepartmentBodySchema });
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>["body"];

export const UpdateDepartmentBodySchema = registry.register(
    "UpdateDepartmentDto",
    z.object({
        name: z.string().min(1, "Department name cannot be empty").optional().openapi({ example: "Engineering v2" }),
        managerId: z.number().int().positive().optional().openapi({ example: 2 }),
        isActive: z.boolean().optional().openapi({ example: false }),
    })
);

export const updateDepartmentSchema = z.object({
    params: departmentIdSchema.shape.params,
    body: UpdateDepartmentBodySchema,
});
export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>["body"];

export const DepartmentResponseSchema = registry.register(
    "DepartmentResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Engineering" }),
        managerId: z.number().int().optional().openapi({ example: 1 }),
        isActive: z.boolean().openapi({ example: true }),
        createdAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
        updatedAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
        deletedAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
    })
);

export class DepartmentManagerResponseDto {
    managerId: number;
    name: string;
    email: string;
    username: string;
}

export class DepartmentResponseDto {
    id: number;
    name: string;
    manager?: DepartmentManagerResponseDto;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export const toDepartmentManagerResponseDto = (manager: any): DepartmentManagerResponseDto => ({
    managerId: manager.id,
    name: manager.name,
    email: manager.email,
    username: manager.username,
});

export const toDepartmentResponseDto = (dept: any): DepartmentResponseDto => ({
    id: dept.id,
    name: dept.name,
    manager: dept.manager ? toDepartmentManagerResponseDto(dept.manager) : undefined,
    isActive: dept.is_active,
    createdAt: dept.created_at,
    updatedAt: dept.updated_at,
    deletedAt: dept.deleted_at,
});

export const toDepartmentResponseDtoList = (list: any[]) =>
    list.map(toDepartmentResponseDto);