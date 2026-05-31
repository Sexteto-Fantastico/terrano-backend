import { AppDataSource } from "../infra/config/data-source";
import { PurchaseItem } from "../infra/entities/purchase-item.entity";

const repo = AppDataSource.getRepository(PurchaseItem);

async function getItemsByPurchaseId(purchaseId: number, withDeleted = false): Promise<PurchaseItem[]> {
    return repo.find({ where: { purchase: { id: purchaseId } }, relations: ["product"], withDeleted });
}

async function getItemById(id: number, withDeleted = false): Promise<PurchaseItem | null> {
    return repo.findOne({ where: { id }, relations: ["product"], withDeleted });
}

async function saveItem(item: PurchaseItem): Promise<PurchaseItem> {
    return await repo.save(item);
}

async function removeItem(item: PurchaseItem): Promise<PurchaseItem> {
    return await repo.softRemove(item);
}

async function recoverItem(item: PurchaseItem): Promise<PurchaseItem> {
    return await repo.recover(item);
}

export { getItemsByPurchaseId, getItemById, saveItem, removeItem, recoverItem };
