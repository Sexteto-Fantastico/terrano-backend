import { AppDataSource } from "../infra/config/data-source";
import { StockLocationProduct } from "../infra/entities/stock-location-product.entity";
import { StockHealthReportQuery, StockHealthSummaryResponse } from "../dtos/stock-health-report.dto";

const repository = AppDataSource.getRepository(StockLocationProduct);

const HEALTH_STATUS_CASE = `CASE
    WHEN slp.quantity <= 0 THEN 'ESGOTADO'
    WHEN product.min_stock IS NOT NULL AND slp.quantity < product.min_stock THEN 'BAIXO'
    ELSE NULL
END`;

function baseQuery() {
    return repository.createQueryBuilder("slp")
        .leftJoinAndSelect("slp.product", "product")
        .leftJoinAndSelect("product.category", "category")
        .leftJoinAndSelect("product.brand", "brand")
        .leftJoinAndSelect("product.measurement_unit", "measurement_unit")
        .leftJoinAndSelect("slp.location", "location");
}

async function getCriticalStockItems(filters: StockHealthReportQuery = {}): Promise<[StockLocationProduct[], number]> {
    const { pageIndex, pageSize, stockLocationId, search, status } = filters;

    const queryBuilder = baseQuery().andWhere(`${HEALTH_STATUS_CASE} IS NOT NULL`);

    if (stockLocationId) {
        queryBuilder.andWhere("slp.location_id = :stockLocationId", { stockLocationId });
    }

    if (search) {
        queryBuilder.andWhere(
            "(product.name LIKE :search OR product.code LIKE :search)",
            { search: `%${search}%` }
        );
    }

    if (status) {
        queryBuilder.andWhere(`${HEALTH_STATUS_CASE} = :status`, { status });
    }

    queryBuilder.orderBy("slp.quantity", "ASC");

    if (pageIndex !== undefined && pageSize !== undefined) {
        queryBuilder.skip((pageIndex - 1) * pageSize);
        queryBuilder.take(pageSize);
    }

    return await queryBuilder.getManyAndCount();
}

async function getStockHealthSummary(stockLocationId?: number): Promise<StockHealthSummaryResponse> {
    const queryBuilder = repository.createQueryBuilder("slp")
        .leftJoin("slp.product", "product")
        .select("COUNT(*)", "totalTracked")
        .addSelect(`SUM(CASE WHEN slp.quantity <= 0 THEN 1 ELSE 0 END)`, "outOfStock")
        .addSelect(
            `SUM(CASE WHEN slp.quantity > 0 AND product.min_stock IS NOT NULL AND slp.quantity < product.min_stock THEN 1 ELSE 0 END)`,
            "lowStock"
        );

    if (stockLocationId) {
        queryBuilder.andWhere("slp.location_id = :stockLocationId", { stockLocationId });
    }

    const raw = await queryBuilder.getRawOne<{ totalTracked: string; outOfStock: string; lowStock: string }>();

    const totalTracked = Number(raw?.totalTracked ?? 0);
    const outOfStock = Number(raw?.outOfStock ?? 0);
    const lowStock = Number(raw?.lowStock ?? 0);
    const totalCritical = outOfStock + lowStock;

    return {
        totalTracked,
        outOfStock,
        lowStock,
        totalCritical,
        criticalPercentage: totalTracked > 0 ? Number(((totalCritical / totalTracked) * 100).toFixed(2)) : 0,
    };
}

export {
    getCriticalStockItems,
    getStockHealthSummary,
};
