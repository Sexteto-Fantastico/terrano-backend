import { AppDataSource } from "../infra/config/data-source";
import { StockLocation } from "../infra/entities/stock-location.entity";

const repository = AppDataSource.getRepository(StockLocation);

async function getAllStockLocations(filters: { activeOnly?: boolean; pageIndex?: number; pageSize?: number; } = {}): Promise<[StockLocation[], number]> {
    const { activeOnly = false, pageIndex, pageSize } = filters;

    const dbQuery: any = {
        withDeleted: !activeOnly,
    };

    if (pageIndex !== undefined && pageSize !== undefined) {
        dbQuery.take = pageSize;
        dbQuery.skip = (pageIndex - 1) * pageSize;
        return await repository.findAndCount(dbQuery);
    }

    const results = await repository.find(dbQuery);
    return [results, results.length];
}

async function getStockLocationById(id: number): Promise<StockLocation | null> {
    return await repository.findOne({
        where: { id },
        withDeleted: true,
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