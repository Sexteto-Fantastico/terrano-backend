import { AppDataSource } from "../infra/config/data-source";
import { StockRequisition } from "../infra/entities/stock-requisition.entity";

const repository =
    AppDataSource.getRepository(StockRequisition);

async function getStockRequisitions(filters = {}) {
    return repository.findAndCount({
        relations: {
            items: {
                product: true,
            },
        },
        order: {
            created_at: "DESC",
        },
    });
}

async function getStockRequisitionById(id: number) {
    return repository.findOne({
        where: { id },
        relations: {
            items: {
                product: true,
            },
        },
    });
}

async function saveStockRequisition(
    requisition: Partial<StockRequisition>
) {
    return repository.save(
        repository.create(requisition)
    );
}

async function updateStockRequisition(
    requisition: StockRequisition
) {
    return repository.save(requisition);
}

async function deleteStockRequisition(id: number) {
    const result = await repository.softDelete(id);
    return result.affected === 1;
}

export {
    getStockRequisitions,
    getStockRequisitionById,
    saveStockRequisition,
    updateStockRequisition,
    deleteStockRequisition,
};