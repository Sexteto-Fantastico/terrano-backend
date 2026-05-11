import {
    findAllMeasurementUnits,
    findMeasurementUnitById,
    createMeasurementUnit,
    updateMeasurementUnit,
    softDeleteMeasurementUnit,
    restoreMeasurementUnit as restoreMeasurementUnitRepo,
} from "../repositories/measurement-unit.repository";
import {
    CreateMeasurementUnitDto,
    UpdateMeasurementUnitDto,
    MeasurementUnitResponseDto,
    toMeasurementUnitResponseDto,
    MeasurementUnitQueryDto,
} from "../dtos/measurement-unit.dto";
import { NotFoundError, BadRequestError } from "../errors";
import { MeasurementUnitType, MeasurementUnitSymbol } from "../infra/entities/measurement-unit.entity";

export async function getAllMeasurementUnits(query: MeasurementUnitQueryDto): Promise<MeasurementUnitResponseDto[]> {
    const activeOnly = query.activeOnly !== undefined ? query.activeOnly : true;

    const units = await findAllMeasurementUnits({
        name: query.name,
        activeOnly,
    });

    return units.map(toMeasurementUnitResponseDto);
}

export async function getMeasurementUnitById(id: number): Promise<MeasurementUnitResponseDto> {
    const unit = await findMeasurementUnitById(id);
    if (!unit) {
        throw new NotFoundError("Measurement Unit not found");
    }
    return toMeasurementUnitResponseDto(unit);
}

export async function createNewMeasurementUnit(data: CreateMeasurementUnitDto): Promise<MeasurementUnitResponseDto> {
    if (!Object.values(MeasurementUnitSymbol).includes(data.symbol)) {
        throw new BadRequestError("Invalid measurement unit symbol");
    }
    if (!Object.values(MeasurementUnitType).includes(data.type)) {
        throw new BadRequestError("Invalid measurement unit type");
    }

    const unit = await createMeasurementUnit({
        name: data.name,
        symbol: data.symbol,
        type: data.type,
    });

    return toMeasurementUnitResponseDto(unit);
}

export async function updateExistingMeasurementUnit(id: number, data: UpdateMeasurementUnitDto): Promise<MeasurementUnitResponseDto> {
    const unit = await findMeasurementUnitById(id);
    if (!unit) {
        throw new NotFoundError("Measurement Unit not found");
    }

    if (data.name && data.name !== unit.name) {
        unit.name = data.name;
    }

    if (data.symbol) {
        if (!Object.values(MeasurementUnitSymbol).includes(data.symbol)) {
            throw new BadRequestError("Invalid measurement unit symbol");
        }
        unit.symbol = data.symbol;
    }

    if (data.type) {
        if (!Object.values(MeasurementUnitType).includes(data.type)) {
            throw new BadRequestError("Invalid measurement unit type");
        }
        unit.type = data.type;
    }

    const updatedUnit = await updateMeasurementUnit(unit);
    return toMeasurementUnitResponseDto(updatedUnit);
}

export async function removeMeasurementUnit(id: number): Promise<void> {
    const unit = await findMeasurementUnitById(id);
    if (!unit) {
        throw new NotFoundError("Measurement Unit not found");
    }

    if (unit.deleted_at) {
        throw new BadRequestError("Measurement Unit is already deactivated");
    }

    await softDeleteMeasurementUnit(unit);
}

export async function restoreMeasurementUnit(id: number): Promise<MeasurementUnitResponseDto> {
    const unit = await findMeasurementUnitById(id);
    if (!unit) {
        throw new NotFoundError("Measurement Unit not found");
    }

    if (!unit.deleted_at) {
        throw new BadRequestError("Measurement Unit is not deactivated");
    }

    const restoredUnit = await restoreMeasurementUnitRepo(unit);
    return toMeasurementUnitResponseDto(restoredUnit);
}
