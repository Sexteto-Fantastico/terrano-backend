import { Router } from "express";
import { z } from "zod";
import {
    getStockPositionings,
    getStockPositioningMetrics,
    exportStockReport
} from "../controllers/stock-positioning.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    StockPositioningQuerySchema,
    StockPositioningResponseSchema,
    StockPositioningMetricsResponseSchema,
    ExportStockReportBodySchema
} from "../dtos/stock-positioning.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_POSITIONINGS.GET_ALL,
    basePath: Endpoints.STOCK_POSITIONINGS.BASE,
    tags: ["Stock Positioning"],
    summary: "Returns the list of stock positionings (paginated and filtered)",
    request: {
        query: StockPositioningQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of stock positionings",
            content: { [ContentType.JSON]: { schema: z.array(StockPositioningResponseSchema) } }
        }
    },
}, getStockPositionings);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_POSITIONINGS.METRICS,
    basePath: Endpoints.STOCK_POSITIONINGS.BASE,
    tags: ["Stock Positioning"],
    summary: "Get stock positioning metrics",
    request: {
        query: z.object({
            stockLocationId: z.coerce.number().int().positive().optional()
        })
    },
    responses: {
        200: {
            description: "Stock positioning metrics",
            content: { [ContentType.JSON]: { schema: StockPositioningMetricsResponseSchema } }
        }
    }
}, getStockPositioningMetrics);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.STOCK_POSITIONINGS.EXPORT,
    basePath: Endpoints.STOCK_POSITIONINGS.BASE,
    tags: ["Stock Positioning"],
    summary: "Export stock positioning report",
    request: {
        body: { content: { [ContentType.JSON]: { schema: ExportStockReportBodySchema } } }
    },
    responses: {
        204: { description: "Report exported successfully" }
    }
}, exportStockReport);

export default router;
