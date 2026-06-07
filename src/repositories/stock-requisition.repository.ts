import { AppDataSource } from "../infra/config/data-source";
import { StockRequisition, RequisitionStatus } from "../infra/entities/stock-requisition.entity";
import { Between, In, IsNull, Not } from "typeorm";

const repository = AppDataSource.getRepository(StockRequisition);

const OPEN_STATUSES: RequisitionStatus[] = [
    RequisitionStatus.PENDING,
    RequisitionStatus.APPROVED,
    RequisitionStatus.WAITING_PURCHASE,
    RequisitionStatus.WAITING_ARRIVAL,
];

async function getStockRequisitions(filters: {
    status?: RequisitionStatus;
    startDate?: string;
    endDate?: string;
    openOnly?: boolean | string;
    activeOnly?: boolean | string;
    pageIndex?: number;
    pageSize?: number;
} = {}) {
    const openOnly = filters.openOnly === true || filters.openOnly === "true";
    const activeOnly = filters.activeOnly === undefined || filters.activeOnly === true || filters.activeOnly === "true";

    const where: any = {};

    if (openOnly) {
        where.status = In(OPEN_STATUSES);
    } else if (filters.status) {
        where.status = filters.status;
    }

    if (filters.startDate && filters.endDate) {
        where.created_at = Between(
            new Date(filters.startDate),
            new Date(filters.endDate)
        );
    }

    if (!activeOnly) {
        where.deleted_at = Not(IsNull());
    }

    return repository.findAndCount({
        where,
        relations: {
            items: { product: true },
            department: true,
            status_logs: true,
        },
        order: { created_at: "DESC" },
        skip: ((filters.pageIndex ?? 1) - 1) * (filters.pageSize ?? 10),
        take: filters.pageSize ?? 10,
        withDeleted: !activeOnly,
    });
}
async function getStockRequisitionById(id: number) {
    return repository.findOne({
        where: { id },
        relations: {
            items: { product: true },
            department: true,
            status_logs: true,
        },
    });
}

async function saveStockRequisition(requisition: Partial<StockRequisition>) {
    return repository.save(repository.create(requisition));
}

async function updateStockRequisition(requisition: StockRequisition) {
    return repository.save(requisition);
}

async function deleteStockRequisition(id: number) {
    const result = await repository.softDelete(id);
    return result.affected === 1;
}

async function restoreStockRequisition(id: number) {
    const result = await repository.restore(id);
    return result.affected === 1;
}

export {
    getStockRequisitions,
    getStockRequisitionById,
    saveStockRequisition,
    updateStockRequisition,
    deleteStockRequisition,
    restoreStockRequisition,
};