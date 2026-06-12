import { FindOptionsWhere, FindManyOptions, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { StockLocation } from "../infra/entities/stock-location.entity";
import { StockLocationQuery } from "../dtos/stock-location.dto";

const repository = AppDataSource.getRepository(StockLocation);

async function getAllStockLocations(filters: StockLocationQuery = {}): Promise<[StockLocation[], number]> {
    const { activeOnly = true, name, pageIndex, pageSize, sortBy, sortOrder } = filters;

    const where: FindOptionsWhere<StockLocation> = {};

    if (name) {
        where.name = ILike(`%${name}%`);
    }

    const options: FindManyOptions<StockLocation> = {
        where,
        withDeleted: !activeOnly,
        relations: ["address"],
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return await repository.findAndCount(options);
    }

    const results = await repository.find(options);
    return [results, results.length];
}

async function getStockLocationById(id: number): Promise<StockLocation | null> {
    return await repository.findOne({
        where: { id },
        withDeleted: true,
        relations: ["address"],
    });
}

async function saveStockLocation(data: Partial<StockLocation>): Promise<StockLocation> {
    const entity = repository.create(data);
    return await repository.save(entity);
}

async function deleteStockLocation(id: number): Promise<boolean> {
    const entity = await repository.findOne({ where: { id } });
    if (!entity) return false;

    await repository.softRemove(entity);
    return true;
}

async function restoreStockLocation(id: number): Promise<StockLocation | null> {
    const entity = await repository.findOne({
        where: { id },
        withDeleted: true,
    });

    if (!entity || !entity.deleted_at) return null;

    await repository.recover(entity);
    return entity;
}

export {
    getAllStockLocations,
    getStockLocationById,
    saveStockLocation,
    deleteStockLocation,
    restoreStockLocation
};