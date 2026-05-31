import { AppDataSource } from "../infra/config/data-source";
import { Movement, MovementType } from "../infra/entities/movement.entity";

const movementRepository = AppDataSource.getRepository(Movement);

async function getGrandTotalQuantity(type: MovementType): Promise<number> {
    const qb = movementRepository.createQueryBuilder("movement");
    if (type === MovementType.IN) {
        qb.where("movement.movement_entry_id IS NOT NULL");
    } else {
        qb.where("movement.movement_exit_id IS NOT NULL");
    }
    const result = await qb.select("SUM(movement.quantity)", "total").getRawOne();
    return Math.abs(Number(result?.total || 0));
}

async function getTotalQuantityByDateRange(
    type: MovementType,
    startDate: string,
    endDate: string
): Promise<number> {
    const qb = movementRepository.createQueryBuilder("movement");
    if (type === MovementType.IN) {
        qb.where("movement.movement_entry_id IS NOT NULL");
    } else {
        qb.where("movement.movement_exit_id IS NOT NULL");
    }
    qb.andWhere("movement.created_at >= :startDate", { startDate })
      .andWhere("movement.created_at < :endDate", { endDate });
      
    const result = await qb.select("SUM(movement.quantity)", "total").getRawOne();
    return Math.abs(Number(result?.total || 0));
}

export { getGrandTotalQuantity, getTotalQuantityByDateRange, movementRepository };
