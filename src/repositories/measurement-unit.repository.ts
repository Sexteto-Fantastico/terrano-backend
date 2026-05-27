import { FindOptionsWhere, FindManyOptions, FindOptionsOrder, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { MeasurementUnit } from "../infra/entities/measurement-unit.entity";
import { MeasurementUnitQuery } from "../dtos/measurement-unit.dto";

const repository = AppDataSource.getRepository(MeasurementUnit);

export async function findAllMeasurementUnits(filters: MeasurementUnitQuery = {}): Promise<[MeasurementUnit[], number]> {
    const { name, activeOnly = true, pageIndex, pageSize, sortBy, sortOrder } = filters;

    const where: FindOptionsWhere<MeasurementUnit> = {};

    if (name) where.name = ILike(`%${name}%`);

    const options: FindManyOptions<MeasurementUnit> = {
        where,
        withDeleted: !activeOnly,
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return repository.findAndCount(options);
    }

    const results = await repository.find(options);
    return [results, results.length];
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
