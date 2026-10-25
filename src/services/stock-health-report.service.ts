import {
    StockHealthReportQuery,
    StockHealthReportItem,
    StockHealthSummaryResponse,
    toStockHealthReportItemList,
} from "../dtos/stock-health-report.dto";
import * as StockHealthReportRepository from "../repositories/stock-health-report.repository";

async function getStockHealthReport(
    filters: StockHealthReportQuery = {}
): Promise<[StockHealthReportItem[], number]> {
    const [entities, total] = await StockHealthReportRepository.getCriticalStockItems(filters);
    return [toStockHealthReportItemList(entities), total];
}

async function getStockHealthSummary(stockLocationId?: number): Promise<StockHealthSummaryResponse> {
    return await StockHealthReportRepository.getStockHealthSummary(stockLocationId);
}

export {
    getStockHealthReport,
    getStockHealthSummary,
};
