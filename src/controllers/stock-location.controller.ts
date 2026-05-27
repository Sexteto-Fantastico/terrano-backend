import { Request, Response } from "express";
import * as StockLocationService from "../services/stock-location.service";
import {
    CreateStockLocation,
    UpdateStockLocation,
    StockLocationResponse,
    StockLocationQuery
} from "../dtos/stock-location.dto";

async function getAllStockLocations(
    req: Request<{}, StockLocationResponse[], {}, StockLocationQuery>,
    res: Response<StockLocationResponse[]>
) {
    const [data, total] = await StockLocationService.getAllStockLocations(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(data);
}

async function getStockLocationById(
    req: Request<{ id: string }, StockLocationResponse>,
    res: Response<StockLocationResponse>
) {
    const id = Number(req.params.id);
    const data = await StockLocationService.getStockLocationById(id);
    res.status(200).json(data);
}

async function createStockLocation(
    req: Request<StockLocationResponse, CreateStockLocation>,
    res: Response<StockLocationResponse>
) {
    const data = await StockLocationService.createStockLocation(req.body);
    res.status(201).json(data);
}

async function updateStockLocation(
    req: Request<{ id: string }, StockLocationResponse, UpdateStockLocation>,
    res: Response<StockLocationResponse>
) {
    const id = Number(req.params.id);
    const data = await StockLocationService.updateStockLocation(id, req.body);
    res.status(200).json(data);
}

async function deleteStockLocation(
    req: Request<{ id: string }>,
    res: Response
) {
    const id = Number(req.params.id);
    await StockLocationService.deleteStockLocation(id);
    res.status(204).send();
}

async function restoreStockLocation(
    req: Request<{ id: string }, StockLocationResponse>,
    res: Response<StockLocationResponse>
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