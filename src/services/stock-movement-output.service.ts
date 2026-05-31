import { BadRequestError, NotFoundError } from "../errors";

import * as StockMovementOutputRepository from "../repositories/stock-movement-output.repository";
import * as StockRequisitionRepository from "../repositories/stock-requisition.repository";

import { StockMovementOutput } from "../infra/entities/stock-movement-output.entity";

type CreateStockMovementOutputDto = any;
type UpdateStockMovementOutputDto = any;

async function getAllStockMovementOutputs(filters: any = {}) {
    return await StockMovementOutputRepository.getAllStockMovementOutputs(filters);
}

async function getStockMovementOutputById(id: number) {

    const output = await StockMovementOutputRepository.getStockMovementOutputById(id);

    if (!output) {
        throw new NotFoundError("Stock movement output not found");
    }

    return output;
}

async function createStockMovementOutput(data: CreateStockMovementOutputDto) {

    await validateStockMovementOutputData(data);

    let requisition;

    if (data.requisitionId) {
        requisition = await StockRequisitionRepository.getStockRequisitionById(
            data.requisitionId
        );

        if (!requisition) {
            throw new NotFoundError("Stock requisition not found");
        }
    }

    const output = new StockMovementOutput({
        requisition,
    });

    return await StockMovementOutputRepository.saveStockMovementOutput(output);
}

async function updateStockMovementOutput(
    id: number,
    data: UpdateStockMovementOutputDto
) {

    await validateStockMovementOutputData(data);

    const output = await StockMovementOutputRepository.getStockMovementOutputById(id);

    if (!output) {
        throw new NotFoundError("Stock movement output not found");
    }

    if (data.requisitionId !== undefined) {

        if (data.requisitionId === null) {

            output.requisition = undefined;

        } else {

            const requisition =
                await StockRequisitionRepository.getStockRequisitionById(
                    data.requisitionId
                );

            if (!requisition) {
                throw new NotFoundError("Stock requisition not found");
            }

            output.requisition = requisition;
        }
    }

    return await StockMovementOutputRepository.saveStockMovementOutput(output);
}

async function deleteStockMovementOutput(id: number) {

    const output =
        await StockMovementOutputRepository.getStockMovementOutputById(
            id,
            true
        );

    if (!output) {
        throw new NotFoundError("Stock movement output not found");
    }

    if (output.deleted_at) {
        return true;
    }

    await StockMovementOutputRepository.deleteStockMovementOutput(output);

    return true;
}

async function restoreStockMovementOutput(id: number) {

    const output =
        await StockMovementOutputRepository.getStockMovementOutputById(
            id,
            true
        );

    if (!output) {
        throw new NotFoundError("Stock movement output not found");
    }

    if (!output.deleted_at) {
        throw new BadRequestError(
            "Stock movement output is not deleted"
        );
    }

    await StockMovementOutputRepository.restoreStockMovementOutput(output);

    return await StockMovementOutputRepository.getStockMovementOutputById(
        id,
        true
    );
}

async function validateStockMovementOutputData(
    data: CreateStockMovementOutputDto | UpdateStockMovementOutputDto
) {

    if (
        data.requisitionId !== undefined &&
        data.requisitionId !== null
    ) {

        if (data.requisitionId <= 0) {
            throw new BadRequestError("Invalid requisitionId");
        }

        const requisition =
            await StockRequisitionRepository.getStockRequisitionById(
                data.requisitionId
            );

        if (!requisition) {
            throw new NotFoundError("Stock requisition not found");
        }
    }
}

export {
    getAllStockMovementOutputs,
    getStockMovementOutputById,
    createStockMovementOutput,
    updateStockMovementOutput,
    deleteStockMovementOutput,
    restoreStockMovementOutput,
};