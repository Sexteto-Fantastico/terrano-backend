import { AppDataSource } from "../infra/config/data-source";
import { StockRequisitionItem } from "../infra/entities/stock-requisition-item.entity";

const stockRequisitionItemRepository = AppDataSource.getRepository(StockRequisitionItem);

async function getStockRequisitionItemById(
    id: number,
    withDeleted = false
): Promise<StockRequisitionItem | null> {
    return stockRequisitionItemRepository.findOne({
        where: { id },
        relations: ["product", "requisition"],
        withDeleted,
    });
}

async function saveStockRequisitionItem(
    item: StockRequisitionItem
): Promise<StockRequisitionItem> {
    return await stockRequisitionItemRepository.save(item);
}

async function deleteStockRequisitionItem(item: StockRequisitionItem): Promise<boolean> {
    const result = await stockRequisitionItemRepository.softRemove(item);
    return !!result;
}

async function restoreStockRequisitionItem(
    item: StockRequisitionItem
): Promise<StockRequisitionItem> {
    return await stockRequisitionItemRepository.recover(item);
}

async function getItemsByRequisitionId(
    requisitionId: number,
    withDeleted = false
): Promise<StockRequisitionItem[]> {
    const qb = stockRequisitionItemRepository
        .createQueryBuilder("item")
        .leftJoinAndSelect("item.product", "product")
        .where("item.requisition_id = :requisitionId", { requisitionId })
        .orderBy("item.created_at", "ASC");

    if (!withDeleted) {
        qb.andWhere("item.deleted_at IS NULL");
    }

    return await qb.getMany();
}

export {
    getStockRequisitionItemById,
    saveStockRequisitionItem,
    deleteStockRequisitionItem,
    restoreStockRequisitionItem,
    getItemsByRequisitionId,
};