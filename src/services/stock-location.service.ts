import {
    CreateStockLocationDto,
    UpdateStockLocationDto,
    StockLocationResponseDto,
    toStockLocationResponseDto,
    toStockLocationResponseDtoList
} from "../dtos/stock-location.dto";

import { NotFoundError } from "../errors/app-error";

import * as StockLocationRepository from "../repositories/stock-location.repository";
import * as AddressRepository from "../repositories/address.repository";

async function getAllStockLocations(
    activeOnly: boolean = false
): Promise<StockLocationResponseDto[]> {

    return await StockLocationRepository
        .getAllStockLocations(activeOnly)
        .then(toStockLocationResponseDtoList);
}

async function getStockLocationById(
    id: number
): Promise<StockLocationResponseDto> {

    const entity = await StockLocationRepository
        .getStockLocationById(id);

    if (!entity) {
        throw new NotFoundError("Stock location not found");
    }

    return toStockLocationResponseDto(entity);
}

async function createStockLocation(
    data: CreateStockLocationDto
): Promise<StockLocationResponseDto> {

    const { address, ...stockLocationData } = data;

    const saved = await StockLocationRepository
        .saveStockLocation(stockLocationData);

    if (address) {
        await AddressRepository.saveAddress({
            ...address,
            stock_location: saved
        });
    }

    return toStockLocationResponseDto(saved);
}

async function updateStockLocation(
    id: number,
    data: UpdateStockLocationDto
): Promise<StockLocationResponseDto> {

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

    return toStockLocationResponseDto(saved);
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
): Promise<StockLocationResponseDto> {

    const restored = await StockLocationRepository
        .restoreStockLocation(id);

    if (!restored) {
        throw new NotFoundError(
            "Stock location not found or not deleted"
        );
    }

    return toStockLocationResponseDto(restored);
}

export {
    getAllStockLocations,
    getStockLocationById,
    createStockLocation,
    updateStockLocation,
    deleteStockLocation,
    restoreStockLocation
};