import { AppDataSource } from "../infra/config/data-source";
import { StockMovementEntry } from "../infra/entities/stock-movement-entry.entity";

const stockMovementEntryRepository = AppDataSource.getRepository(StockMovementEntry);

async function getStockMovementEntryById(id: number, withDeleted = false): Promise<StockMovementEntry | null> {
    return stockMovementEntryRepository.findOne({
        where: { id },
        relations: ["purchase"],
        withDeleted
    });
}

async function saveStockMovementEntry(entry: StockMovementEntry): Promise<StockMovementEntry> {
    return await stockMovementEntryRepository.save(entry);
}

async function deleteStockMovementEntry(entry: StockMovementEntry): Promise<boolean> {
    const result = await stockMovementEntryRepository.softRemove(entry);
    return !!result;
}

async function restoreStockMovementEntry(entry: StockMovementEntry): Promise<StockMovementEntry> {
    return await stockMovementEntryRepository.recover(entry);
}

async function getAllStockMovementEntries(filters: any = {}): Promise<[StockMovementEntry[], number]> {
    const {
        pageIndex,
        pageSize,
        activeOnly = true,
        purchaseId,
    } = filters;

    const qb = stockMovementEntryRepository
        .createQueryBuilder("movementEntry")
        .leftJoinAndSelect("movementEntry.purchase", "purchase")
        .orderBy("movementEntry.created_at", "DESC");

    if (!activeOnly) {
        qb.withDeleted();
    }

    if (purchaseId !== undefined) {
        qb.andWhere("purchase.id = :purchaseId", { purchaseId });
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        qb.take(pageSize);
        qb.skip((pageIndex - 1) * pageSize);
    }

    return await qb.getManyAndCount();
}

export {
    getStockMovementEntryById,
    saveStockMovementEntry,
    deleteStockMovementEntry,
    restoreStockMovementEntry,
    getAllStockMovementEntries,
};