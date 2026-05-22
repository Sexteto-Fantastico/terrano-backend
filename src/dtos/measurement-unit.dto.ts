import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";
import { MeasurementUnit, MeasurementUnitSymbol, MeasurementUnitType } from "../infra/entities/measurement-unit.entity";

export const measurementUnitIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const measurementUnitQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    })
});
export type MeasurementUnitQueryDto = z.infer<typeof measurementUnitQuerySchema>["query"];

export const CreateMeasurementUnitBodySchema = registry.register(
    "CreateMeasurementUnitDto",
    z.object({
        name: z.string().min(1, "Measurement unit name is required").openapi({ example: "Kilogram" }),
        symbol: z.enum(MeasurementUnitSymbol, { message: "Invalid measurement unit symbol" }).openapi({ example: MeasurementUnitSymbol.KG }),
        type: z.enum(MeasurementUnitType, { message: "Invalid measurement unit type" }).openapi({ example: MeasurementUnitType.MASS }),
    })
);

export const createMeasurementUnitSchema = z.object({ body: CreateMeasurementUnitBodySchema });
export type CreateMeasurementUnitDto = z.infer<typeof createMeasurementUnitSchema>["body"];

export const UpdateMeasurementUnitBodySchema = registry.register(
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

export const MeasurementUnitResponseSchema = registry.register(
    "MeasurementUnitResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Kilogram" }),
        symbol: z.enum(MeasurementUnitSymbol).openapi({ example: MeasurementUnitSymbol.KG }),
        type: z.enum(MeasurementUnitType).openapi({ example: MeasurementUnitType.MASS }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

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
