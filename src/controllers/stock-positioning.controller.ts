import { Request, Response } from "express";
import {
    StockPositioningQuery,
    StockPositioningResponse,
    StockPositioningMetricsResponse,
    ExportStockReportBody
} from "../dtos/stock-positioning.dto";
import * as StockPositioningService from "../services/stock-positioning.service";

async function getStockPositionings(
    req: Request<{}, StockPositioningResponse[], {}, StockPositioningQuery>,
    res: Response<StockPositioningResponse[]>
) {
    const [results, total] = await StockPositioningService.getStockPositionings(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(results);
}

async function getStockPositioningMetrics(
    req: Request<{}, StockPositioningMetricsResponse, {}, { stockLocationId?: string }>,
    res: Response<StockPositioningMetricsResponse>
) {
    const stockLocationId = req.query.stockLocationId 
        ? parseInt(req.query.stockLocationId, 10) 
        : undefined;

    const metrics = await StockPositioningService.getStockPositioningMetrics(stockLocationId);
    res.status(200).json(metrics);
}

async function exportStockReport(
    req: Request<{}, void, ExportStockReportBody>,
    res: Response<void>
) {
    await StockPositioningService.exportStockReport(req.body);
    res.status(204).send();
}

export {
    getStockPositionings,
    getStockPositioningMetrics,
    exportStockReport
};
