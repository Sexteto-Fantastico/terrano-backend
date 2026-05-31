import { AppDataSource } from "../infra/config/data-source";
import { StockMovement } from "../infra/entities/stock-movement.entity";

const stockMovementRepository = AppDataSource.getRepository(StockMovement);

async function getStockMovementById(id: number, withDeleted = false): Promise<StockMovement | null> {
    return stockMovementRepository.findOne({
        where: { id },
        relations: [
            "product",
            "location",
            "movement_entry",
            "movement_output",
        ],
        withDeleted,
    });
}

async function saveStockMovement(movement: StockMovement): Promise<StockMovement> {
    return await stockMovementRepository.save(movement);
}

async function deleteStockMovement(movement: StockMovement): Promise<boolean> {
    const result = await stockMovementRepository.softRemove(movement);
    return !!result;
}

async function restoreStockMovement(movement: StockMovement): Promise<StockMovement> {
    return await stockMovementRepository.recover(movement);
}

async function getAllStockMovements(filters: any = {}): Promise<[StockMovement[], number]> {
    const {
        pageIndex,
        pageSize,
        activeOnly = true,
        productId,
        locationId,
        movementEntryId,
        movementOutputId,
    } = filters;

    const qb = stockMovementRepository
        .createQueryBuilder("movement")
        .leftJoinAndSelect("movement.product", "product")
        .leftJoinAndSelect("movement.location", "location")
        .leftJoinAndSelect("movement.movement_entry", "movementEntry")
        .leftJoinAndSelect("movement.movement_output", "movementOutput")
        .orderBy("movement.created_at", "DESC");

    if (!activeOnly) {
        qb.withDeleted();
    }

    if (productId !== undefined) {
        qb.andWhere("product.id = :productId", { productId });
    }

    if (locationId !== undefined) {
        qb.andWhere("location.id = :locationId", { locationId });
    }

    if (movementEntryId !== undefined) {
        qb.andWhere("movementEntry.id = :movementEntryId", { movementEntryId });
    }

    if (movementOutputId !== undefined) {
        qb.andWhere("movementOutput.id = :movementOutputId", { movementOutputId });
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        qb.take(pageSize);
        qb.skip((pageIndex - 1) * pageSize);
    }

    return await qb.getManyAndCount();
}

export {
    getStockMovementById,
    saveStockMovement,
    deleteStockMovement,
    restoreStockMovement,
    getAllStockMovements,
};