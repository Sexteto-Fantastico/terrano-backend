import { Request, Response } from "express";
import * as StockLocationService from "../services/stock-location.service";
import {
    CreateStockLocationDto,
    UpdateStockLocationDto,
    StockLocationResponseDto,
    StockLocationQueryDto
} from "../dtos/stock-location.dto";

async function getAllStockLocations(
    req: Request<{}, StockLocationResponseDto[], {}, StockLocationQueryDto>,
    res: Response<StockLocationResponseDto[]>
) {
    const [data, total] = await StockLocationService.getAllStockLocations(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(data);
}

async function getStockLocationById(
    req: Request<{ id: string }, StockLocationResponseDto>,
    res: Response<StockLocationResponseDto>
) {
    const id = Number(req.params.id);
    const data = await StockLocationService.getStockLocationById(id);
    res.status(200).json(data);
}

async function createStockLocation(
    req: Request<StockLocationResponseDto, CreateStockLocationDto>,
    res: Response<StockLocationResponseDto>
) {
    const data = await StockLocationService.createStockLocation(req.body);
    res.status(201).json(data);
}

async function updateStockLocation(
    req: Request<{ id: string }, StockLocationResponseDto, UpdateStockLocationDto>,
    res: Response<StockLocationResponseDto>
) {
    const id = Number(req.params.id);
    const data = await StockLocationService.updateStockLocation(id, req.body);
    res.status(200).json(data);
}

async function deleteStockLocation(
    req: Request<{ id: string }>,
    res: Response<{ message: string }>
) {
    const id = Number(req.params.id);
    await StockLocationService.deleteStockLocation(id);
    res.status(200).json({ message: "Stock location deleted successfully" });
}

async function restoreStockLocation(
    req: Request<{ id: string }, StockLocationResponseDto>,
    res: Response<StockLocationResponseDto>
) {
    const id = Number(req.params.id);
    const data = await StockLocationService.restoreStockLocation(id);
    res.status(200).json(data);
}

export {
    getAllStockLocations,
    getStockLocationById,
    createStockLocation,
    updateStockLocation,
    deleteStockLocation,
    restoreStockLocation
};