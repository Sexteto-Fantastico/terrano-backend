import {CreateStockLocationDto, UpdateStockLocationDto, StockLocationResponseDto, toStockLocationResponseDto, toStockLocationResponseDtoList} from "../dtos/stock-location.dto";
import { NotFoundError } from "../errors/app-error";
import * as StockLocationRepository from "../repositories/stock-location.repository";
import * as AddressRepository from "../repositories/address.repository";
import { SystemLogRepository } from "../repositories/system-log.repository";
import { LogLevel } from "../infra/logger/logger.interface";

async function getAllStockLocations(activeOnly: boolean = false): Promise<StockLocationResponseDto[]> {
    return await StockLocationRepository.getAllStockLocations(activeOnly)
        .then(toStockLocationResponseDtoList);
}

async function getStockLocationById(id: number): Promise<StockLocationResponseDto> {
    const entity = await StockLocationRepository.getStockLocationById(id);

    if (!entity) {
        throw new NotFoundError("Stock location not found");
    }

    return toStockLocationResponseDto(entity);
}

async function createStockLocation(data: CreateStockLocationDto): Promise<StockLocationResponseDto> {
    try {
        const { address, ...stockLocationData } = data;

        const saved = await StockLocationRepository.saveStockLocation(stockLocationData);

        if (address) {
            await AddressRepository.saveAddress({
                ...address,
                stock_location: saved
            });
        }

        await SystemLogRepository.save({
            level: LogLevel.INFO,
            message: "Stock location created",
            status_code: 201,
            entity_name: "stock_location",
            entity_id: saved.id,
            action: "CREATE",
            metadata: { ...data }
        });

        return toStockLocationResponseDto(saved);

    } catch (error: any) {
        await SystemLogRepository.save({
            level: LogLevel.ERROR,
            message: "Error creating stock location",
            status_code: 500,
            entity_name: "stock_location",
            action: "CREATE",
            metadata: { error: error.message, data: { ...data } }
        });

        throw error;
    }
}

async function updateStockLocation(id: number, data: UpdateStockLocationDto): Promise<StockLocationResponseDto> {
    try {
        const existing = await StockLocationRepository.getStockLocationById(id);

        if (!existing) {
            throw new NotFoundError("Stock location not found");
        }

        const { address, ...stockLocationData } = data;

        const updated = Object.assign(existing, stockLocationData);
        const saved = await StockLocationRepository.saveStockLocation(updated);

        if (address) {
            const addresses = await AddressRepository.getAllAddresses();
            const existingAddress = addresses.find(
                a => a.stock_location?.id === saved.id
            );

            if (existingAddress) {
                const updatedAddress = Object.assign(existingAddress, address);
                await AddressRepository.saveAddress(updatedAddress);
            } else {
                await AddressRepository.saveAddress({
                    ...address,
                    stock_location: saved
                });
            }
        }

        await SystemLogRepository.save({
            level: LogLevel.INFO,
            message: "Stock location updated",
            status_code: 200,
            entity_name: "stock_location",
            entity_id: saved.id,
            action: "UPDATE",
            metadata: { ...data }
        });

        return toStockLocationResponseDto(saved);

    } catch (error: any) {
        await SystemLogRepository.save({
            level: LogLevel.ERROR,
            message: "Error updating stock location",
            status_code: 500,
            entity_name: "stock_location",
            entity_id: id,
            action: "UPDATE",
            metadata: { error: error.message }
        });

        throw error;
    }
}

async function deleteStockLocation(id: number): Promise<boolean> {
    try {
        const existing = await StockLocationRepository.getStockLocationById(id);

        if (!existing) {
            throw new NotFoundError("Stock location not found");
        }

        await StockLocationRepository.deleteStockLocation(id);

        await SystemLogRepository.save({
            level: LogLevel.INFO,
            message: "Stock location deleted",
            status_code: 200,
            entity_name: "stock_location",
            entity_id: id,
            action: "DELETE"
        });

        return true;

    } catch (error: any) {
        await SystemLogRepository.save({
            level: LogLevel.ERROR,
            message: "Error deleting stock location",
            status_code: 500,
            entity_name: "stock_location",
            entity_id: id,
            action: "DELETE",
            metadata: { error: error.message }
        });

        throw error;
    }
}

async function restoreStockLocation(id: number): Promise<StockLocationResponseDto> {
    try {
        const restored = await StockLocationRepository.restoreStockLocation(id);

        if (!restored) {
            throw new NotFoundError("Stock location not found or not deleted");
        }

        await SystemLogRepository.save({
            level: LogLevel.INFO,
            message: "Stock location restored",
            status_code: 200,
            entity_name: "stock_location",
            entity_id: restored.id,
            action: "RESTORE"
        });

        return toStockLocationResponseDto(restored);

    } catch (error: any) {
        await SystemLogRepository.save({
            level: LogLevel.ERROR,
            message: "Error restoring stock location",
            status_code: 500,
            entity_name: "stock_location",
            entity_id: id,
            action: "RESTORE",
            metadata: { error: error.message }
        });

        throw error;
    }
}

export {getAllStockLocations, getStockLocationById, createStockLocation, updateStockLocation, deleteStockLocation, restoreStockLocation};