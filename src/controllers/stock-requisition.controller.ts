import { Request, Response } from "express";
import * as StockRequisitionService from "../services/stock-requisition.service";

async function createStockRequisition(req: Request, res: Response) {
    const requisition = await StockRequisitionService.createStockRequisition(req.body);
    return res.status(201).json(requisition);
}

async function getStockRequisitions(req: Request, res: Response) {
    const [items, total] = await StockRequisitionService.getStockRequisitions(req.query as any);
    res.setHeader("X-Total-Count", String(total));
    return res.status(200).json(items);
}

async function getStockRequisitionById(req: Request, res: Response) {
    const requisition = await StockRequisitionService.getStockRequisitionById(
        Number(req.params.id)
    );
    return res.status(200).json(requisition);
}

async function updateStockRequisition(req: Request, res: Response) {
    const requisition = await StockRequisitionService.updateStockRequisition(
        Number(req.params.id),
        req.body
    );
    return res.status(200).json(requisition);
}

async function updateStockRequisitionStatus(req: Request, res: Response) {
    const requisition = await StockRequisitionService.updateStockRequisitionStatus(
        Number(req.params.id),
        req.body
    );
    return res.status(200).json(requisition);
}

async function deleteStockRequisition(req: Request, res: Response) {
    await StockRequisitionService.deleteStockRequisition(Number(req.params.id));
    return res.sendStatus(204);
}

async function restoreStockRequisition(req: Request, res: Response) {
    const requisition = await StockRequisitionService.restoreStockRequisition(
        Number(req.params.id)
    );
    return res.status(200).json(requisition);
}

export {
    createStockRequisition,
    getStockRequisitions,
    getStockRequisitionById,
    updateStockRequisition,
    updateStockRequisitionStatus,
    deleteStockRequisition,
    restoreStockRequisition,
};