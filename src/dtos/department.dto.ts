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
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    })
});

export const CreateDepartmentBodySchema = registry.register(
    "CreateDepartmentDto",
    z.object({
        name: z.string().min(1, "Department name is required").openapi({ example: "Engineering" }),
        costCenterCode: z.string().min(1, "Cost center code is required").openapi({ example: "CC-ENG-01" }),
        managerId: z.number().int().positive("Manager ID is required").openapi({ example: 1 }),
    })
);

export const createDepartmentSchema = z.object({ body: CreateDepartmentBodySchema });
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>["body"];

export const UpdateDepartmentBodySchema = registry.register(
    "UpdateDepartmentDto",
    z.object({
        name: z.string().min(1, "Department name cannot be empty").optional().openapi({ example: "Engineering v2" }),
        costCenterCode: z.string().min(1, "Cost center code cannot be empty").optional().openapi({ example: "CC-ENG-02" }),
        managerId: z.number().int().positive().optional().openapi({ example: 2 }),
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
        costCenterCode: z.string().openapi({ example: "CC-ENG-01" }),
        managerId: z.number().int().optional().openapi({ example: 1 }),
        deletedAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
    })
);

export class DepartmentResponseDto {
    id: number;
    name: string;
    costCenterCode: string;
    managerId?: number;
    deletedAt?: Date;
}

export const toDepartmentResponseDto = (dept: any): DepartmentResponseDto => ({
    id: dept.id,
    name: dept.name,
    costCenterCode: dept.cost_center_code,
    managerId: dept.manager?.id || dept.manager_id,
    deletedAt: dept.deleted_at,
});

export const toDepartmentResponseDtoList = (list: any[]) =>
    list.map(toDepartmentResponseDto);