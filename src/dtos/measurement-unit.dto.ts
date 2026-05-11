import { MeasurementUnit, MeasurementUnitSymbol, MeasurementUnitType } from "../infra/entities/measurement-unit.entity";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMeasurementUnitDto:
 *       type: object
 *       required:
 *         - name
 *         - symbol
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the measurement unit
 *         symbol:
 *           type: string
 *           enum: [UN, KG, L, M, CX, PCT, OTHER]
 *           description: The symbol representing the unit
 *         type:
 *           type: string
 *           enum: [MASS, VOLUME, LENGTH, AREA, UNIT]
 *           description: The type of measurement
 *
 *     UpdateMeasurementUnitDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the measurement unit
 *         symbol:
 *           type: string
 *           enum: [UN, KG, L, M, CX, PCT, OTHER]
 *           description: The symbol representing the unit
 *         type:
 *           type: string
 *           enum: [MASS, VOLUME, LENGTH, AREA, UNIT]
 *           description: The type of measurement
 *
 *     MeasurementUnitResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         symbol:
 *           type: string
 *           enum: [UN, KG, L, M, CX, PCT, OTHER]
 *         type:
 *           type: string
 *           enum: [MASS, VOLUME, LENGTH, AREA, UNIT]
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

export interface CreateMeasurementUnitDto {
    name: string;
    symbol: MeasurementUnitSymbol;
    type: MeasurementUnitType;
}

export interface UpdateMeasurementUnitDto {
    name?: string;
    symbol?: MeasurementUnitSymbol;
    type?: MeasurementUnitType;
}

export interface MeasurementUnitQueryDto {
    name?: string;
    activeOnly?: boolean;
}

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
