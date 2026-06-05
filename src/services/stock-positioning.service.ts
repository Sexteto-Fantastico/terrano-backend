import {
    StockPositioningQuery,
    StockPositioningResponse,
    StockPositioningMetricsResponse,
    toStockPositioningResponse,
    toStockPositioningStatus,
    ExportStockReportBody,
    StockPositioningStatus
} from "../dtos/stock-positioning.dto";
import * as StockPositioningRepository from "../repositories/stock-positioning.repository";

async function getStockPositionings(
    filters: StockPositioningQuery = {}
): Promise<[StockPositioningResponse[], number]> {
    const [entities, total] = await StockPositioningRepository.getStockPositionings(filters);
    const responses = entities.map(toStockPositioningResponse);
    return [responses, total];
}

async function getStockPositioningMetrics(
    stockLocationId?: number
): Promise<StockPositioningMetricsResponse> {
    const entities = await StockPositioningRepository.getAllStockPositionings(stockLocationId);

    let totalItems = 0;
    let lowStock = 0;
    let excessStock = 0;
    let outOfStock = 0;

    for (const entity of entities) {
        totalItems++;
        const status = toStockPositioningStatus(entity.quantity, entity.product.min_stock, entity.product.max_stock);

        if (status === StockPositioningStatus.ESGOTADO) outOfStock++;
        else if (status === StockPositioningStatus.BAIXO) lowStock++;
        else if (status === StockPositioningStatus.EXCESSO) excessStock++;
    }

    return {
        totalItems,
        lowStock,
        excessStock,
        outOfStock
    };
}

async function exportStockReport(
    data: ExportStockReportBody
): Promise<boolean> {
    return true;
}

export {
    getStockPositionings,
    getStockPositioningMetrics,
    exportStockReport
};
