import { AppDataSource } from "../infra/config/data-source";
import { StockRequisition } from "../infra/entities/stock-requisition.entity";

const stockRequisitionRepository = AppDataSource.getRepository(StockRequisition);

async function getStockRequisitionById(
    id: number,
    withDeleted = false
): Promise<StockRequisition | null> {
    return stockRequisitionRepository.findOne({
        where: { id },
        relations: [
            "department",
            "items",
            "items.product",
            "stock_movement_outputs",
        ],
        withDeleted,
    });
}

async function saveStockRequisition(
    requisition: StockRequisition
): Promise<StockRequisition> {
    return await stockRequisitionRepository.save(requisition);
}

async function deleteStockRequisition(
    requisition: StockRequisition
): Promise<boolean> {
    const result = await stockRequisitionRepository.softRemove(requisition);
    return !!result;
}

async function restoreStockRequisition(
    requisition: StockRequisition
): Promise<StockRequisition> {
    return await stockRequisitionRepository.recover(requisition);
}

async function getAllStockRequisitions(filters: any = {}): Promise<[StockRequisition[], number]> {
    const {
        pageIndex,
        pageSize,
        activeOnly = true,
        status,
        departmentId,
    } = filters;

    const qb = stockRequisitionRepository
        .createQueryBuilder("requisition")
        .leftJoinAndSelect("requisition.department", "department")
        .leftJoinAndSelect("requisition.items", "items")
        .orderBy("requisition.declared_at", "DESC");

    if (!activeOnly) {
        qb.withDeleted();
    }

    if (status !== undefined) {
        qb.andWhere("requisition.status = :status", { status });
    }

    if (departmentId !== undefined) {
        qb.andWhere("department.id = :departmentId", { departmentId });
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        qb.take(pageSize);
        qb.skip((pageIndex - 1) * pageSize);
    }

    return await qb.getManyAndCount();
}

export {
    getStockRequisitionById,
    saveStockRequisition,
    deleteStockRequisition,
    restoreStockRequisition,
    getAllStockRequisitions,
};