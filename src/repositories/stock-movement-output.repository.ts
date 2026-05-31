import { AppDataSource } from "../infra/config/data-source";
import { StockMovementOutput } from "../infra/entities/stock-movement-output.entity";

const stockMovementOutputRepository = AppDataSource.getRepository(StockMovementOutput);

async function getStockMovementOutputById(id: number, withDeleted = false): Promise<StockMovementOutput | null> {
    return stockMovementOutputRepository.findOne({
        where: { id },
        relations: ["requisition"],
        withDeleted
    });
}

async function saveStockMovementOutput(output: StockMovementOutput): Promise<StockMovementOutput> {
    return await stockMovementOutputRepository.save(output);
}

async function deleteStockMovementOutput(output: StockMovementOutput): Promise<boolean> {
    const result = await stockMovementOutputRepository.softRemove(output);
    return !!result;
}

async function restoreStockMovementOutput(output: StockMovementOutput): Promise<StockMovementOutput> {
    return await stockMovementOutputRepository.recover(output);
}

async function getAllStockMovementOutputs(filters: any = {}): Promise<[StockMovementOutput[], number]> {
    const {
        pageIndex,
        pageSize,
        activeOnly = true,
        requisitionId,
    } = filters;

    const qb = stockMovementOutputRepository
        .createQueryBuilder("movementOutput")
        .leftJoinAndSelect("movementOutput.requisition", "requisition")
        .orderBy("movementOutput.created_at", "DESC");

    if (!activeOnly) {
        qb.withDeleted();
    }

    if (requisitionId !== undefined) {
        qb.andWhere("requisition.id = :requisitionId", { requisitionId });
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        qb.take(pageSize);
        qb.skip((pageIndex - 1) * pageSize);
    }

    return await qb.getManyAndCount();
}

export {
    getStockMovementOutputById,
    saveStockMovementOutput,
    deleteStockMovementOutput,
    restoreStockMovementOutput,
    getAllStockMovementOutputs,
};