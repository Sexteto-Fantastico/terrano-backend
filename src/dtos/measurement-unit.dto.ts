import { z, registry } from "../infra/config/openapi";
import { MeasurementUnit, MeasurementUnitSymbol, MeasurementUnitType } from "../infra/entities/measurement-unit.entity";

// ============ Schemas ============

export const measurementUnitIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const measurementUnitQuerySchema = z.object({
    query: z.object({
        name: z.string().optional(),
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    }).default({})
});
export type MeasurementUnitQueryDto = z.infer<typeof measurementUnitQuerySchema>["query"];

const CreateMeasurementUnitBodySchema = registry.register(
    "CreateMeasurementUnitDto",
    z.object({
        name: z.string().min(1, "Measurement unit name is required").openapi({ example: "Kilogram" }),
        symbol: z.enum(MeasurementUnitSymbol, { message: "Invalid measurement unit symbol" }).openapi({ example: MeasurementUnitSymbol.KG }),
        type: z.enum(MeasurementUnitType, { message: "Invalid measurement unit type" }).openapi({ example: MeasurementUnitType.MASS }),
    })
);

export const createMeasurementUnitSchema = z.object({ body: CreateMeasurementUnitBodySchema });
export type CreateMeasurementUnitDto = z.infer<typeof createMeasurementUnitSchema>["body"];

const UpdateMeasurementUnitBodySchema = registry.register(
    "UpdateMeasurementUnitDto",
    z.object({
        name: z.string().min(1, "Measurement unit name cannot be empty").optional().openapi({ example: "Meter" }),
        symbol: z.enum(MeasurementUnitSymbol, { message: "Invalid measurement unit symbol" }).optional().openapi({ example: MeasurementUnitSymbol.M }),
        type: z.enum(MeasurementUnitType, { message: "Invalid measurement unit type" }).optional().openapi({ example: MeasurementUnitType.LENGTH }),
    })
);

export const updateMeasurementUnitSchema = z.object({
    params: measurementUnitIdSchema.shape.params,
    body: UpdateMeasurementUnitBodySchema,
});
export type UpdateMeasurementUnitDto = z.infer<typeof updateMeasurementUnitSchema>["body"];

// ============ Response Schemas ============

const MeasurementUnitResponseSchema = registry.register(
    "MeasurementUnitResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Kilogram" }),
        symbol: z.enum(MeasurementUnitSymbol).openapi({ example: MeasurementUnitSymbol.KG }),
        type: z.enum(MeasurementUnitType).openapi({ example: MeasurementUnitType.MASS }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

// ============ Route Registrations ============

registry.registerPath({
    method: "get",
    path: "/api/measurement-units",
    tags: ["Measurement Units"],
    summary: "Retrieve a list of measurement units",
    request: {
        query: z.object({
            name: z.string().optional(),
            activeOnly: z.string().optional()
        })
    },
    responses: {
        200: { description: "A list of measurement units", content: { "application/json": { schema: z.array(MeasurementUnitResponseSchema) } } }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/measurement-units/{id}",
    tags: ["Measurement Units"],
    summary: "Get a measurement unit by ID",
    request: { params: measurementUnitIdSchema.shape.params },
    responses: {
        200: { description: "Measurement unit details", content: { "application/json": { schema: MeasurementUnitResponseSchema } } },
        404: { description: "Measurement unit not found" }
    }
});

registry.registerPath({
    method: "post",
    path: "/api/measurement-units",
    tags: ["Measurement Units"],
    summary: "Create a new measurement unit",
    request: { body: { content: { "application/json": { schema: CreateMeasurementUnitBodySchema } } } },
    responses: {
        201: { description: "The created measurement unit", content: { "application/json": { schema: MeasurementUnitResponseSchema } } },
        409: { description: "Measurement unit with the given name already exists" }
    }
});

registry.registerPath({
    method: "put",
    path: "/api/measurement-units/{id}",
    tags: ["Measurement Units"],
    summary: "Update an existing measurement unit",
    request: {
        params: measurementUnitIdSchema.shape.params,
        body: { content: { "application/json": { schema: UpdateMeasurementUnitBodySchema } } }
    },
    responses: {
        200: { description: "The updated measurement unit", content: { "application/json": { schema: MeasurementUnitResponseSchema } } },
        404: { description: "Measurement unit not found" },
        409: { description: "Measurement unit with the given name already exists" }
    }
});

registry.registerPath({
    method: "delete",
    path: "/api/measurement-units/{id}",
    tags: ["Measurement Units"],
    summary: "Deactivate a measurement unit (soft delete)",
    request: { params: measurementUnitIdSchema.shape.params },
    responses: {
        204: { description: "Successfully deactivated" },
        400: { description: "Measurement unit is already deactivated" },
        404: { description: "Measurement unit not found" }
    }
});

registry.registerPath({
    method: "post",
    path: "/api/measurement-units/{id}/restore",
    tags: ["Measurement Units"],
    summary: "Restore a deactivated measurement unit",
    request: { params: measurementUnitIdSchema.shape.params },
    responses: {
        200: { description: "Successfully restored", content: { "application/json": { schema: MeasurementUnitResponseSchema } } },
        400: { description: "Measurement unit is not deactivated" },
        404: { description: "Measurement unit not found" }
    }
});

// ============ Runtime DTOs ============

export interface MeasurementUnitResponseDto {
    id: number;
    name: string;
    symbol: MeasurementUnitSymbol;
    type: MeasurementUnitType;
    deletedAt: Date | null;
}

export function toMeasurementUnitResponseDto(entity: MeasurementUnit): MeasurementUnitResponseDto {
    return {
        id: entity.id,
        name: entity.name,
        symbol: entity.symbol,
        type: entity.type,
        deletedAt: entity.deleted_at || null,
    };
}
