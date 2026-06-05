import {
    CreateStockRequisitionDto,
    UpdateStockRequisitionDto,
    StockRequisitionResponseDto,
    toStockRequisitionResponseDto,
    toStockRequisitionResponseDtoList,
} from "../dtos/stock-requisition.dto";

import { NotFoundError, BadRequestError } from "../errors/app-error";

import * as StockRequisitionRepository from "../repositories/stock-requisition.repository";
import * as ProductRepository from "../repositories/product.repository";

import {
    RequisitionStatus,
} from "../infra/entities/stock-requisition.entity";

async function getStockRequisitions(filters = {}):
    Promise<[StockRequisitionResponseDto[], number]> {

    const [all, total] =
        await StockRequisitionRepository.getStockRequisitions(filters);

    return [
        toStockRequisitionResponseDtoList(all),
        total
    ];
}

async function getStockRequisitionById(
    id: number
): Promise<StockRequisitionResponseDto> {

    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    return toStockRequisitionResponseDto(requisition);
}

async function createStockRequisition(
    data: CreateStockRequisitionDto
): Promise<StockRequisitionResponseDto> {

    const items: any[] = [];

    for (const item of data.items) {

        const product =
            await ProductRepository.getProductById(item.productId);

        if (!product) {
            throw new NotFoundError(
                `Product ${item.productId} not found`
            );
        }

        items.push({
    product,
    quantity: item.quantity,
    delivered: false,
});
    }

 const saved =
    await StockRequisitionRepository.saveStockRequisition({
        requester_justification:
            data.requesterJustification,

        status: RequisitionStatus.PENDING,

        items,
    });

    return toStockRequisitionResponseDto(saved);
}

async function updateStockRequisition(
    id: number,
    data: UpdateStockRequisitionDto
): Promise<StockRequisitionResponseDto> {

    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    if (requisition.status !== RequisitionStatus.PENDING) {
        throw new BadRequestError(
            "Only pending requisitions can be updated"
        );
    }

 if (data.requesterJustification !== undefined) {
    requisition.requester_justification =
        data.requesterJustification;
}
    const saved =
        await StockRequisitionRepository.updateStockRequisition(
            requisition
        );

    return toStockRequisitionResponseDto(saved);
}

async function deleteStockRequisition(
    id: number
): Promise<boolean> {

    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    if (requisition.status !== RequisitionStatus.PENDING) {
        throw new BadRequestError(
            "Only pending requisitions can be cancelled"
        );
    }

    return StockRequisitionRepository.deleteStockRequisition(id);
}

export {
    getStockRequisitions,
    getStockRequisitionById,
    createStockRequisition,
    updateStockRequisition,
    deleteStockRequisition,
};