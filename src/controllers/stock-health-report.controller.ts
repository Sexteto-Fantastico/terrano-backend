import { Request, Response } from "express";
import * as StockHealthReportService from "../services/stock-health-report.service";
import {
    StockHealthReportQuery,
    StockHealthReportItem,
    StockHealthSummaryResponse,
} from "../dtos/stock-health-report.dto";

async function getStockHealthReport(
    req: Request<unknown, StockHealthReportItem[], unknown, StockHealthReportQuery>,
    res: Response<StockHealthReportItem[]>
) {
    const [items, total] = await StockHealthReportService.getStockHealthReport(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(items);
}

async function getStockHealthSummary(
    req: Request<unknown, StockHealthSummaryResponse, unknown, { stockLocationId?: string }>,
    res: Response<StockHealthSummaryResponse>
) {
    const stockLocationId = req.query.stockLocationId ? parseInt(req.query.stockLocationId, 10) : undefined;
    const summary = await StockHealthReportService.getStockHealthSummary(stockLocationId);
    res.status(200).json(summary);
}

export {
    getStockHealthReport,
    getStockHealthSummary,
};
