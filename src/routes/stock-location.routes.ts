import { Router } from "express";
import { z } from "zod";
import {
    createStockLocation,
    getAllStockLocations,
    getStockLocationById,
    updateStockLocation,
    deleteStockLocation,
    restoreStockLocation
} from "../controllers/stock-location.controller";
import { getStockLocationLogs } from "../controllers/system-log.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    StockLocationQuerySchema,
    CreateStockLocationBodySchema,
    UpdateStockLocationBodySchema,
    StockLocationIdSchema,
    StockLocationResponseSchema,
} from "../dtos/stock-location.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.STOCK_LOCATIONS.CREATE,
    basePath: Endpoints.STOCK_LOCATIONS.BASE,
    tags: ["Stock Locations"],
    summary: "Create a new stock location",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateStockLocationBodySchema } } }
    },
    responses: {
        201: {
            description: "The created stock location",
            content: { [ContentType.JSON]: { schema: StockLocationResponseSchema } }
        }
    },
    permissions: { resource: "STOCK_LOCATION", action: "CREATE" },
}, createStockLocation);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_LOCATIONS.GET_ALL,
    permissions: { resource: "STOCK_LOCATION", action: "READ" },
    basePath: Endpoints.STOCK_LOCATIONS.BASE,
    tags: ["Stock Locations"],
    summary: "Returns the list of stock locations",
    description: "Supports pagination, sorting, activeOnly, and name filtering. Each item includes isActive derived from deleted_at.",
    request: {
        query: StockLocationQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of stock locations",
            content: { [ContentType.JSON]: { schema: z.array(StockLocationResponseSchema) } }
        }
    },
}, getAllStockLocations);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_LOCATIONS.GET_BY_ID,
    basePath: Endpoints.STOCK_LOCATIONS.BASE,
    tags: ["Stock Locations"],
    summary: "Get a stock location by id",
    request: {
        params: StockLocationIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The stock location",
            content: { [ContentType.JSON]: { schema: StockLocationResponseSchema } }
        },
        404: { description: "Stock location not found" }
    },
    permissions: { resource: "STOCK_LOCATION", action: "READ" },
}, getStockLocationById);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_LOCATIONS.GET_LOGS,
    permissions: { resource: "STOCK_LOCATION", action: "READ" },
    basePath: Endpoints.STOCK_LOCATIONS.BASE,
    tags: ["Stock Locations"],
    summary: "Get logs for a stock location",
    request: {
        params: StockLocationIdSchema.shape.params
    },
    responses: {
        200: { description: "List of stock location logs" }
    }
}, getStockLocationLogs);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.STOCK_LOCATIONS.UPDATE,
    basePath: Endpoints.STOCK_LOCATIONS.BASE,
    tags: ["Stock Locations"],
    summary: "Update a stock location",
    request: {
        params: StockLocationIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateStockLocationBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated stock location",
            content: { [ContentType.JSON]: { schema: StockLocationResponseSchema } }
        },
        404: { description: "Stock location not found" }
    },
    permissions: { resource: "STOCK_LOCATION", action: "UPDATE" },
}, updateStockLocation);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.STOCK_LOCATIONS.DELETE,
    permissions: { resource: "STOCK_LOCATION", action: "DELETE" },
    basePath: Endpoints.STOCK_LOCATIONS.BASE,
    tags: ["Stock Locations"],
    summary: "Soft delete a stock location",
    request: {
        params: StockLocationIdSchema.shape.params
    },
    responses: {
        204: { description: "Stock location deleted successfully" }
    }
}, deleteStockLocation);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.STOCK_LOCATIONS.RESTORE,
    basePath: Endpoints.STOCK_LOCATIONS.BASE,
    tags: ["Stock Locations"],
    summary: "Restore a soft-deleted stock location",
    request: {
        params: StockLocationIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The restored stock location",
            content: { [ContentType.JSON]: { schema: StockLocationResponseSchema } }
        },
        404: { description: "Stock location not found" }
    },
    permissions: { resource: "STOCK_LOCATION", action: "UPDATE" },
}, restoreStockLocation);

export default router;