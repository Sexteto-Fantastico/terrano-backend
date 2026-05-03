import { CreateStockLocationDto, UpdateStockLocationDto, StockLocationResponseDto, toStockLocationResponseDto, toStockLocationResponseDtoList} from "../dtos/stock-location.dto";
import { NotFoundError } from "../errors/app-error";
import * as StockLocationRepository from "../repositories/stock-location.repository";

async function getAllStockLocations(activeOnly: boolean = false): Promise<StockLocationResponseDto[]> {
    const list = await StockLocationRepository.getAllStockLocations(activeOnly);
    return toStockLocationResponseDtoList(list);
}

async function getStockLocationById(id: number): Promise<StockLocationResponseDto> {
    const entity = await StockLocationRepository.getStockLocationById(id);

    if (!entity) {
        throw new NotFoundError("Stock location not found");
    }

    return toStockLocationResponseDto(entity);
}

async function createStockLocation(data: CreateStockLocationDto): Promise<StockLocationResponseDto> {
    const saved = await StockLocationRepository.saveStockLocation(data);
    return toStockLocationResponseDto(saved);
}

async function updateStockLocation(id: number, data: UpdateStockLocationDto): Promise<StockLocationResponseDto> {
    const existing = await StockLocationRepository.getStockLocationById(id);

    if (!existing) {
        throw new NotFoundError("Stock location not found");
    }

    const updated = Object.assign(existing, data);
    const saved = await StockLocationRepository.saveStockLocation(updated);

    return toStockLocationResponseDto(saved);
}

async function deleteStockLocation(id: number): Promise<boolean> {
    const success = await StockLocationRepository.deleteStockLocation(id);

    if (!success) {
        throw new NotFoundError("Stock location not found");
    }

    return true;
}

async function restoreStockLocation(id: number): Promise<StockLocationResponseDto> {
    const restored = await StockLocationRepository.restoreStockLocation(id);

    if (!restored) {
        throw new NotFoundError("Stock location not found or not deleted");
    }

    return toStockLocationResponseDto(restored);
}

export {getAllStockLocations, getStockLocationById, createStockLocation, updateStockLocation, deleteStockLocation, restoreStockLocation};