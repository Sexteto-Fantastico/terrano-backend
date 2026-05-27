import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";
import { MeasurementUnit, MeasurementUnitSymbol, MeasurementUnitType } from "../infra/entities/measurement-unit.entity";

export const MeasurementUnitIdSchema = idParamSchema;

export const MeasurementUnitQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});
export type MeasurementUnitQuery = z.infer<typeof MeasurementUnitQuerySchema>["query"];

export const CreateMeasurementUnitBodySchema = registry.register(
    "CreateMeasurementUnit",
    z.object({
        name: z.string().min(1, "Measurement unit name is required").openapi({ example: "Kilogram" }),
        symbol: z.enum(MeasurementUnitSymbol, { message: "Invalid measurement unit symbol" }).openapi({ example: MeasurementUnitSymbol.KG }),
        type: z.enum(MeasurementUnitType, { message: "Invalid measurement unit type" }).openapi({ example: MeasurementUnitType.MASS }),
    })
);

export const createMeasurementUnitSchema = z.object({ body: CreateMeasurementUnitBodySchema });
export type CreateMeasurementUnit = z.infer<typeof createMeasurementUnitSchema>["body"];

export const UpdateMeasurementUnitBodySchema = registry.register(
    "UpdateMeasurementUnit",
    z.object({
        name: z.string().min(1, "Measurement unit name cannot be empty").optional().openapi({ example: "Meter" }),
        symbol: z.enum(MeasurementUnitSymbol, { message: "Invalid measurement unit symbol" }).optional().openapi({ example: MeasurementUnitSymbol.M }),
        type: z.enum(MeasurementUnitType, { message: "Invalid measurement unit type" }).optional().openapi({ example: MeasurementUnitType.LENGTH }),
    })
);

export const updateMeasurementUnitSchema = z.object({
    params: MeasurementUnitIdSchema.shape.params,
    body: UpdateMeasurementUnitBodySchema,
});
export type UpdateMeasurementUnit = z.infer<typeof updateMeasurementUnitSchema>["body"];

export const MeasurementUnitResponseSchema = registry.register(
    "MeasurementUnitResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Kilogram" }),
        symbol: z.enum(MeasurementUnitSymbol).openapi({ example: MeasurementUnitSymbol.KG }),
        type: z.enum(MeasurementUnitType).openapi({ example: MeasurementUnitType.MASS }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

export type MeasurementUnitResponse = z.infer<typeof MeasurementUnitResponseSchema>;

export function toMeasurementUnitResponse(entity: MeasurementUnit): MeasurementUnitResponse {
    return {
        id: entity.id,
        name: entity.name,
        symbol: entity.symbol,
        type: entity.type,
        deletedAt: entity.deleted_at || null,
    };
}
