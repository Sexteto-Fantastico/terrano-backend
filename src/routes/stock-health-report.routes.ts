import { Router } from "express";
import { z } from "zod";
import {
    getStockHealthReport,
    getStockHealthSummary,
} from "../controllers/stock-health-report.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    StockHealthReportQuerySchema,
    StockHealthReportItemSchema,
    StockHealthSummaryResponseSchema,
} from "../dtos/stock-health-report.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_HEALTH_REPORTS.GET_ALL,
    basePath: Endpoints.STOCK_HEALTH_REPORTS.BASE,
    tags: ["Stock Health Report"],
    summary: "Returns the list of stock items in rupture (out of stock or below minimum)",
    request: {
        query: StockHealthReportQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of critical stock items",
            content: { [ContentType.JSON]: { schema: z.array(StockHealthReportItemSchema) } }
        }
    },
    permissions: { resource: "STOCK_HEALTH", action: "READ" },
}, getStockHealthReport);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_HEALTH_REPORTS.SUMMARY,
    basePath: Endpoints.STOCK_HEALTH_REPORTS.BASE,
    tags: ["Stock Health Report"],
    summary: "Get stock health summary metrics",
    request: {
        query: z.object({
            stockLocationId: z.coerce.number().int().positive().optional()
        })
    },
    responses: {
        200: {
            description: "Stock health summary metrics",
            content: { [ContentType.JSON]: { schema: StockHealthSummaryResponseSchema } }
        }
    },
    permissions: { resource: "STOCK_HEALTH", action: "READ" },
}, getStockHealthSummary);

export default router;
