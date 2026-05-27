import {
    CreateStockLocation,
    UpdateStockLocation,
    StockLocationResponse,
    StockLocationQuery,
    toStockLocationResponse,
    toStockLocationResponseList
} from "../dtos/stock-location.dto";

import { NotFoundError } from "../errors/app-error";

import * as StockLocationRepository from "../repositories/stock-location.repository";
import * as AddressRepository from "../repositories/address.repository";

async function getAllStockLocations(
    filters: StockLocationQuery = {}
): Promise<[StockLocationResponse[], number]> {

    const [locations, total] = await StockLocationRepository.getAllStockLocations(filters);
    return [toStockLocationResponseList(locations), total];
}

async function getStockLocationById(
    id: number
): Promise<StockLocationResponse> {

    const entity = await StockLocationRepository
        .getStockLocationById(id);

    if (!entity) {
        throw new NotFoundError("Stock location not found");
    }

    return toStockLocationResponse(entity);
}

async function createStockLocation(
    data: CreateStockLocation
): Promise<StockLocationResponse> {

    const { address, ...stockLocationData } = data;

    const saved = await StockLocationRepository
        .saveStockLocation(stockLocationData);

    if (address) {
        await AddressRepository.saveAddress({
            ...address,
            stock_location: saved
        });
    }

    return toStockLocationResponse(saved);
}

async function updateStockLocation(
    id: number,
    data: UpdateStockLocation
): Promise<StockLocationResponse> {

    const existing = await StockLocationRepository
        .getStockLocationById(id);

    if (!existing) {
        throw new NotFoundError("Stock location not found");
    }

    const { address, ...stockLocationData } = data;

    const updated = Object.assign(existing, stockLocationData);

    const saved = await StockLocationRepository
        .saveStockLocation(updated);

    if (address) {

        const addresses = await AddressRepository.getAllAddresses();

        const existingAddress = addresses.find(
            a => a.stock_location?.id === saved.id
        );

        if (existingAddress) {

            const updatedAddress = Object.assign(
                existingAddress,
                address
            );

            await AddressRepository.saveAddress(updatedAddress);

        } else {

            await AddressRepository.saveAddress({
                ...address,
                stock_location: saved
            });
        }
    }

    return toStockLocationResponse(saved);
}

async function deleteStockLocation(
    id: number
): Promise<boolean> {

    const existing = await StockLocationRepository
        .getStockLocationById(id);

    if (!existing) {
        throw new NotFoundError("Stock location not found");
    }

    await StockLocationRepository.deleteStockLocation(id);

    return true;
}

async function restoreStockLocation(
    id: number
): Promise<StockLocationResponse> {

    const restored = await StockLocationRepository
        .restoreStockLocation(id);

    if (!restored) {
        throw new NotFoundError(
            "Stock location not found or not deleted"
        );
    }

    return toStockLocationResponse(restored);
}

export {
    getAllStockLocations,
    getStockLocationById,
    createStockLocation,
    updateStockLocation,
    deleteStockLocation,
    restoreStockLocation
};