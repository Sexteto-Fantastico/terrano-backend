import {
    findAllMeasurementUnits,
    findMeasurementUnitById,
    createMeasurementUnit,
    updateMeasurementUnit,
    softDeleteMeasurementUnit,
    restoreMeasurementUnit as restoreMeasurementUnitRepo,
} from "../repositories/measurement-unit.repository";
import {
    CreateMeasurementUnit,
    UpdateMeasurementUnit,
    MeasurementUnitResponse,
    toMeasurementUnitResponse,
    MeasurementUnitQuery,
} from "../dtos/measurement-unit.dto";
import { NotFoundError, BadRequestError } from "../errors";

export async function getAllMeasurementUnits(query: MeasurementUnitQuery): Promise<[MeasurementUnitResponse[], number]> {
    const [units, total] = await findAllMeasurementUnits(query);
    return [units.map(toMeasurementUnitResponse), total];
}

export async function getMeasurementUnitById(id: number): Promise<MeasurementUnitResponse> {
    const unit = await findMeasurementUnitById(id);
    if (!unit) {
        throw new NotFoundError("Measurement Unit not found");
    }
    return toMeasurementUnitResponse(unit);
}

export async function createNewMeasurementUnit(data: CreateMeasurementUnit): Promise<MeasurementUnitResponse> {
    const unit = await createMeasurementUnit({
        name: data.name,
        symbol: data.symbol,
        type: data.type,
    });

    return toMeasurementUnitResponse(unit);
}

export async function updateExistingMeasurementUnit(id: number, data: UpdateMeasurementUnit): Promise<MeasurementUnitResponse> {
    const unit = await findMeasurementUnitById(id);
    if (!unit) {
        throw new NotFoundError("Measurement Unit not found");
    }

    if (data.name && data.name !== unit.name) {
        unit.name = data.name;
    }

    if (data.symbol) {
        unit.symbol = data.symbol;
    }

    if (data.type) {
        unit.type = data.type;
    }

    const updatedUnit = await updateMeasurementUnit(unit);
    return toMeasurementUnitResponse(updatedUnit);
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

export async function restoreMeasurementUnit(id: number): Promise<MeasurementUnitResponse> {
    const unit = await findMeasurementUnitById(id);
    if (!unit) {
        throw new NotFoundError("Measurement Unit not found");
    }

    if (!unit.deleted_at) {
        throw new BadRequestError("Measurement Unit is not deactivated");
    }

    const restoredUnit = await restoreMeasurementUnitRepo(unit);
    return toMeasurementUnitResponse(restoredUnit);
}
