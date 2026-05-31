import { BadRequestError, NotFoundError } from "../errors";

import * as StockMovementEntryRepository from "../repositories/stock-movement-entry.repository";
import * as PurchaseRepository from "../repositories/purchase.repository";

import { StockMovementEntry } from "../infra/entities/stock-movement-entry.entity";

type CreateStockMovementEntryDto = any;
type UpdateStockMovementEntryDto = any;

async function getAllStockMovementEntries(filters: any = {}) {
    return await StockMovementEntryRepository.getAllStockMovementEntries(filters);
}

async function getStockMovementEntryById(id: number) {

    const entry = await StockMovementEntryRepository.getStockMovementEntryById(id);

    if (!entry) {
        throw new NotFoundError("Stock movement entry not found");
    }

    return entry;
}

async function createStockMovementEntry(data: CreateStockMovementEntryDto) {

    await validateStockMovementEntryData(data);

    let purchase;

    if (data.purchaseId) {
        purchase = await PurchaseRepository.getPurchaseById(data.purchaseId);

        if (!purchase) {
            throw new NotFoundError("Purchase not found");
        }
    }

    const entry = new StockMovementEntry({
        purchase,
    });

    return await StockMovementEntryRepository.saveStockMovementEntry(entry);
}

async function updateStockMovementEntry(
    id: number,
    data: UpdateStockMovementEntryDto
) {

    await validateStockMovementEntryData(data);

    const entry = await StockMovementEntryRepository.getStockMovementEntryById(id);

    if (!entry) {
        throw new NotFoundError("Stock movement entry not found");
    }

    if (data.purchaseId !== undefined) {

        if (data.purchaseId === null) {

            entry.purchase = undefined;

        } else {

            const purchase = await PurchaseRepository.getPurchaseById(data.purchaseId);

            if (!purchase) {
                throw new NotFoundError("Purchase not found");
            }

            entry.purchase = purchase;
        }
    }

    return await StockMovementEntryRepository.saveStockMovementEntry(entry);
}

async function deleteStockMovementEntry(id: number) {

    const entry = await StockMovementEntryRepository.getStockMovementEntryById(
        id,
        true
    );

    if (!entry) {
        throw new NotFoundError("Stock movement entry not found");
    }

    if (entry.deleted_at) {
        return true;
    }

    await StockMovementEntryRepository.deleteStockMovementEntry(entry);

    return true;
}

async function restoreStockMovementEntry(id: number) {

    const entry = await StockMovementEntryRepository.getStockMovementEntryById(
        id,
        true
    );

    if (!entry) {
        throw new NotFoundError("Stock movement entry not found");
    }

    if (!entry.deleted_at) {
        throw new BadRequestError(
            "Stock movement entry is not deleted"
        );
    }

    await StockMovementEntryRepository.restoreStockMovementEntry(entry);

    return await StockMovementEntryRepository.getStockMovementEntryById(
        id,
        true
    );
}

async function validateStockMovementEntryData(
    data: CreateStockMovementEntryDto | UpdateStockMovementEntryDto
) {

    if (
        data.purchaseId !== undefined &&
        data.purchaseId !== null
    ) {

        if (data.purchaseId <= 0) {
            throw new BadRequestError("Invalid purchaseId");
        }

        const purchase = await PurchaseRepository.getPurchaseById(
            data.purchaseId
        );

        if (!purchase) {
            throw new NotFoundError("Purchase not found");
        }
    }
}

export {
    getAllStockMovementEntries,
    getStockMovementEntryById,
    createStockMovementEntry,
    updateStockMovementEntry,
    deleteStockMovementEntry,
    restoreStockMovementEntry,
};