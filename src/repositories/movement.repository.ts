import { AppDataSource } from "../infra/config/data-source";
import { Movement, MovementType } from "../infra/entities/movement.entity";
import { MovementEntry } from "../infra/entities/movement-entry.entity";

const movementRepository = AppDataSource.getRepository(Movement);
const movementEntryRepository = AppDataSource.getRepository(MovementEntry);

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

async function getMovementEntries(): Promise<MovementEntry[]> {
    return await movementEntryRepository.find({
        relations: ["purchase"],
        order: { entryDate: "DESC" }
    });
}

async function getMovementEntryById(id: number): Promise<MovementEntry | null> {
    return await movementEntryRepository.findOne({
        where: { id },
        relations: ["purchase", "movements", "movements.product", "movements.stock_location"]
    });
}

export { 
    getGrandTotalQuantity, 
    getTotalQuantityByDateRange, 
    getMovementEntries,
    getMovementEntryById
};