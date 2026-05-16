import { z, registry } from "../infra/config/openapi";

// ============ Schemas ============

export const departmentIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const departmentQuerySchema = z.object({
    query: z.object({
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    }).default({})
});

const CreateDepartmentBodySchema = registry.register(
    "CreateDepartmentDto",
    z.object({
        name: z.string().min(1, "Department name is required").openapi({ example: "Engineering" }),
        costCenterCode: z.string().min(1, "Cost center code is required").openapi({ example: "CC-ENG-01" }),
        managerId: z.number().int().positive("Manager ID is required").openapi({ example: 1 }),
    })
);

export const createDepartmentSchema = z.object({ body: CreateDepartmentBodySchema });
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>["body"];

const UpdateDepartmentBodySchema = registry.register(
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

// ============ Response DTOs ============

const DepartmentResponseSchema = registry.register(
    "DepartmentResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Engineering" }),
        costCenterCode: z.string().openapi({ example: "CC-ENG-01" }),
        managerId: z.number().int().optional().openapi({ example: 1 }),
        deletedAt: z.date().optional().openapi({ type: "string", format: "date-time", example: "2026-05-16T19:42:00.000Z" }),
    })
);

// ============ Route Registrations ============

registry.registerPath({
    method: "post",
    path: "/api/departments",
    tags: ["Departments"],
    summary: "Create a new department",
    request: {
        body: { content: { "application/json": { schema: CreateDepartmentBodySchema } } }
    },
    responses: {
        201: {
            description: "The created department",
            content: { "application/json": { schema: DepartmentResponseSchema } }
        }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/departments",
    tags: ["Departments"],
    summary: "Returns the list of all departments",
    request: {
        query: z.object({
            activeOnly: z.string().optional()
        })
    },
    responses: {
        200: {
            description: "The list of departments",
            content: { "application/json": { schema: z.array(DepartmentResponseSchema) } }
        }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/departments/{id}",
    tags: ["Departments"],
    summary: "Get a department by id",
    request: {
        params: departmentIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The department",
            content: { "application/json": { schema: DepartmentResponseSchema } }
        },
        404: { description: "Department not found" }
    }
});

registry.registerPath({
    method: "put",
    path: "/api/departments/{id}",
    tags: ["Departments"],
    summary: "Update a department",
    request: {
        params: departmentIdSchema.shape.params,
        body: { content: { "application/json": { schema: UpdateDepartmentBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated department",
            content: { "application/json": { schema: DepartmentResponseSchema } }
        },
        404: { description: "Department not found" }
    }
});

registry.registerPath({
    method: "delete",
    path: "/api/departments/{id}",
    tags: ["Departments"],
    summary: "Soft delete a department",
    request: {
        params: departmentIdSchema.shape.params
    },
    responses: {
        200: { description: "Department deleted successfully" }
    }
});

registry.registerPath({
    method: "patch",
    path: "/api/departments/{id}/restore",
    tags: ["Departments"],
    summary: "Restore a soft-deleted department",
    request: {
        params: departmentIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The restored department",
            content: { "application/json": { schema: DepartmentResponseSchema } }
        },
        404: { description: "Department not found" }
    }
});

// ============ Classes for Runtime ============

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