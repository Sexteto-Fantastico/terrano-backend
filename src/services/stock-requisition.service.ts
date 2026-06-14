import {
    CreateStockRequisitionDto,
    UpdateStockRequisitionDto,
    UpdateStockRequisitionStatusDto,
    StockRequisitionResponseDto,
    toStockRequisitionResponseDto,
    toStockRequisitionResponseDtoList,
} from "../dtos/stock-requisition.dto";

import { NotFoundError, BadRequestError } from "../errors/app-error";

import * as StockRequisitionRepository from "../repositories/stock-requisition.repository";

import { AppDataSource } from "../infra/config/data-source";
import { StockRequisitionStatusLog } from "../infra/entities/stock-requisition-status-log.entity";
import { StockRequisitionItem } from "../infra/entities/stock-requisition-item.entity";
import { RequisitionStatus } from "../infra/entities/stock-requisition.entity";
import { StockRequisition } from "../infra/entities/stock-requisition.entity";
import { Department } from "../infra/entities/department.entity";
import * as ProductRepository from "../repositories/product.repository";

const statusLogRepository =
    AppDataSource.getRepository(StockRequisitionStatusLog);

async function getStockRequisitions(filters: any = {}) {
    const pageIndex = Number(filters.pageIndex ?? 1);
    const pageSize = Number(filters.pageSize ?? 10);

    const [all, total] =
        await StockRequisitionRepository.getStockRequisitions({
            ...filters,
            pageIndex,
            pageSize,
        });

    return [
        toStockRequisitionResponseDtoList(all),
        total,
    ];
}

async function getStockRequisitionById(id: number): Promise<StockRequisitionResponseDto> {
    const requisition = await StockRequisitionRepository.getStockRequisitionById(id);
    if (!requisition) throw new NotFoundError("Stock requisition not found");
    return toStockRequisitionResponseDto(requisition);
}

async function createStockRequisition(data: CreateStockRequisitionDto) {
    const items: any[] = [];
    for (const item of data.items) {
        const product = await ProductRepository.getProductById(item.productId);
        if (!product) throw new NotFoundError(`Product ${item.productId} not found`);
        items.push({ product, quantity: item.quantity, delivered: false });
    }

    const saved = await StockRequisitionRepository.saveStockRequisition({
        requester_justification: data.requesterJustification,
        status: RequisitionStatus.PENDING,
        department: data.departmentId ? { id: data.departmentId } as Department : undefined,
        items,
    });

    return toStockRequisitionResponseDto(saved);
}

async function updateStockRequisition(id: number, data: UpdateStockRequisitionDto) {
    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    if (requisition.status !== RequisitionStatus.PENDING) {
        throw new BadRequestError("Only pending requisitions can be updated");
    }

    if (data.requesterJustification !== undefined) {
        requisition.requester_justification = data.requesterJustification;
    }

    const itemRepo = AppDataSource.getRepository(StockRequisitionItem);

    await AppDataSource.transaction(async (manager) => {
        const txItemRepo = manager.getRepository(StockRequisitionItem);
        const txReqRepo = manager.getRepository(StockRequisition);

        if (data.items) {
            await txItemRepo.delete({
                stock_requisition: { id },
            });
            const items = data.items.map(i =>
                txItemRepo.create({
                    product: { id: i.productId },
                    quantity: i.quantity,
                    delivered: false,
                    stock_requisition: { id }, 
                })
            );

            await txItemRepo.save(items);
        }
        await txReqRepo.update(id, {
            requester_justification: requisition.requester_justification,
        });
    });

    const updated =
        await StockRequisitionRepository.getStockRequisitionById(id);

    return toStockRequisitionResponseDto(updated);
}

async function updateStockRequisitionStatus(
    id: number,
    data: UpdateStockRequisitionStatusDto
): Promise<StockRequisitionResponseDto> {

    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    const log = new StockRequisitionStatusLog({} as any);

    log.stock_requisition_id = requisition.id;
    log.previous_status = requisition.status;
    log.current_status = data.status;
    log.change_justification = data.changeJustification;

    await statusLogRepository.save(log);

    requisition.status = data.status;

    await StockRequisitionRepository.updateStockRequisition(requisition);

    const updated =
        await StockRequisitionRepository.getStockRequisitionById(id);

    return toStockRequisitionResponseDto(updated);
}

async function deleteStockRequisition(id: number): Promise<boolean> {
    const requisition = await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    return StockRequisitionRepository.deleteStockRequisition(id);
}

async function restoreStockRequisition(id: number): Promise<StockRequisitionResponseDto> {
    const result = await StockRequisitionRepository.restoreStockRequisition(id);
    if (!result) throw new NotFoundError("Stock requisition not found");
    const requisition = await StockRequisitionRepository.getStockRequisitionById(id);
    return toStockRequisitionResponseDto(requisition);
}

export {
    getStockRequisitions,
    getStockRequisitionById,
    createStockRequisition,
    updateStockRequisition,
    updateStockRequisitionStatus,
    deleteStockRequisition,
    restoreStockRequisition,
};