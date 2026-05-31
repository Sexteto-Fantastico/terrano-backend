import { AppDataSource } from "../infra/config/data-source";
import { StockMovement, MovementType } from "../infra/entities/stock-movement.entity";

const stockMovementRepository = AppDataSource.getRepository(StockMovement);

async function getGrandTotalQuantity(movementType: MovementType): Promise<number> {
    const result = await stockMovementRepository
        .createQueryBuilder("movement")
        .select("SUM(movement.quantity)", "total")
        .where("movement.movement_type = :movementType", { movementType })
        .getRawOne();
    return Number(result?.total || 0);
}

async function getTotalQuantityByDateRange(
    movementType: MovementType,
    startDate: string,
    endDate: string
): Promise<number> {
    const result = await stockMovementRepository
        .createQueryBuilder("movement")
        .select("SUM(movement.quantity)", "total")
        .where("movement.movement_type = :movementType", { movementType })
        .andWhere("movement.created_at >= :startDate", { startDate })
        .andWhere("movement.created_at < :endDate", { endDate })
        .getRawOne();
    return Number(result?.total || 0);
}

export { getGrandTotalQuantity, getTotalQuantityByDateRange };
