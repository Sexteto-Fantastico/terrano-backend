import { AppDataSource } from "../infra/config/data-source";
import { MeasurementUnit } from "../infra/entities/measurement-unit.entity";
import { ILike } from "typeorm";

const repository = AppDataSource.getRepository(MeasurementUnit);

export async function findAllMeasurementUnits(filters: { name?: string; activeOnly?: boolean }, limit: number = 20, offset: number = 0): Promise<[MeasurementUnit[], number]> {
    const { name, activeOnly = true } = filters;

    const where: any = {};
    if (name) {
        where.name = ILike(`%${name}%`);
    }

    return repository.findAndCount({
        where,
        withDeleted: !activeOnly,
        order: { name: "ASC" },
        take: limit,
        skip: offset,
    });
}

export async function findMeasurementUnitById(id: number): Promise<MeasurementUnit | null> {
    return repository.findOne({
        where: { id },
        withDeleted: true,
    });
}

export async function createMeasurementUnit(data: Partial<MeasurementUnit>): Promise<MeasurementUnit> {
    const newUnit = repository.create(data);
    return repository.save(newUnit);
}

export async function updateMeasurementUnit(unit: MeasurementUnit): Promise<MeasurementUnit> {
    return repository.save(unit);
}

export async function softDeleteMeasurementUnit(unit: MeasurementUnit): Promise<MeasurementUnit> {
    return repository.softRemove(unit);
}

export async function restoreMeasurementUnit(unit: MeasurementUnit): Promise<MeasurementUnit> {
    return repository.recover(unit);
}
