import { FindManyOptions, Like } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { StockLocationProduct } from "../infra/entities/stock-location-product.entity";
import { StockPositioningQuery } from "../dtos/stock-positioning.dto";

const repository = AppDataSource.getRepository(StockLocationProduct);

async function getStockPositionings(filters: StockPositioningQuery = {}): Promise<[StockLocationProduct[], number]> {
    const { pageIndex, pageSize, stockLocationId, search } = filters;

    const queryBuilder = repository.createQueryBuilder("slp")
        .leftJoinAndSelect("slp.product", "product")
        .leftJoinAndSelect("product.category", "category")
        .leftJoinAndSelect("product.brand", "brand")
        .leftJoinAndSelect("product.measurement_unit", "measurement_unit")
        .leftJoinAndSelect("slp.location", "location");

    if (stockLocationId) {
        queryBuilder.andWhere("slp.location_id = :stockLocationId", { stockLocationId });
    }

    if (search) {
        queryBuilder.andWhere(
            "(product.name LIKE :search OR product.code LIKE :search)",
            { search: `%${search}%` }
        );
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        queryBuilder.skip((pageIndex - 1) * pageSize);
        queryBuilder.take(pageSize);
    }

    return await queryBuilder.getManyAndCount();
}

async function getAllStockPositionings(stockLocationId?: number): Promise<StockLocationProduct[]> {
    const queryBuilder = repository.createQueryBuilder("slp")
        .leftJoinAndSelect("slp.product", "product")
        .leftJoinAndSelect("product.category", "category")
        .leftJoinAndSelect("product.brand", "brand")
        .leftJoinAndSelect("product.measurement_unit", "measurement_unit")
        .leftJoinAndSelect("slp.location", "location");

    if (stockLocationId) {
        queryBuilder.andWhere("slp.location_id = :stockLocationId", { stockLocationId });
    }

    return await queryBuilder.getMany();
}

export {
    getStockPositionings,
    getAllStockPositionings
};
