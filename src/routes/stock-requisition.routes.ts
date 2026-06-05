import { Router } from "express";
import { z } from "zod";

import {
    createStockRequisition,
    getStockRequisitions,
    getStockRequisitionById,
    updateStockRequisition,
    deleteStockRequisition,
} from "../controllers/stock-requisition.controller";

import {
    CreateStockRequisitionBodySchema,
    UpdateStockRequisitionBodySchema,
    StockRequisitionResponseSchema,
    stockRequisitionIdSchema,
    stockRequisitionQuerySchema,
} from "../dtos/stock-requisition.dto";

import {
    Endpoints,
    HttpMethod,
    ContentType
} from "../utils/constants/endpoints";

import { createRoute } from "../utils/route-builder";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.STOCK_REQUISITIONS.CREATE,
    basePath: Endpoints.STOCK_REQUISITIONS.BASE,
    tags: ["Stock Requisitions"],
    summary: "Create a new stock requisition",
    request: {
        body: {
            content: {
                [ContentType.JSON]: {
                    schema: CreateStockRequisitionBodySchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "The created stock requisition",
            content: {
                [ContentType.JSON]: {
                    schema: StockRequisitionResponseSchema
                }
            }
        }
    }
}, createStockRequisition);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_REQUISITIONS.GET_ALL,
    basePath: Endpoints.STOCK_REQUISITIONS.BASE,
    tags: ["Stock Requisitions"],
    summary: "Returns the list of stock requisitions",
    request: {
        query: stockRequisitionQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of stock requisitions",
            content: {
                [ContentType.JSON]: {
                    schema: z.array(StockRequisitionResponseSchema)
                }
            }
        }
    }
}, getStockRequisitions);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.STOCK_REQUISITIONS.GET_BY_ID,
    basePath: Endpoints.STOCK_REQUISITIONS.BASE,
    tags: ["Stock Requisitions"],
    summary: "Get stock requisition by id",
    request: {
        params: stockRequisitionIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The stock requisition",
            content: {
                [ContentType.JSON]: {
                    schema: StockRequisitionResponseSchema
                }
            }
        },
        404: {
            description: "Stock requisition not found"
        }
    }
}, getStockRequisitionById);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.STOCK_REQUISITIONS.UPDATE,
    basePath: Endpoints.STOCK_REQUISITIONS.BASE,
    tags: ["Stock Requisitions"],
    summary: "Update a stock requisition",
    request: {
        params: stockRequisitionIdSchema.shape.params,
        body: {
            content: {
                [ContentType.JSON]: {
                    schema: UpdateStockRequisitionBodySchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "The updated stock requisition",
            content: {
                [ContentType.JSON]: {
                    schema: StockRequisitionResponseSchema
                }
            }
        },
        404: {
            description: "Stock requisition not found"
        }
    }
}, updateStockRequisition);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.STOCK_REQUISITIONS.DELETE,
    basePath: Endpoints.STOCK_REQUISITIONS.BASE,
    tags: ["Stock Requisitions"],
    summary: "Cancel a stock requisition",
    request: {
        params: stockRequisitionIdSchema.shape.params
    },
    responses: {
        204: {
            description: "Stock requisition cancelled successfully"
        },
        404: {
            description: "Stock requisition not found"
        }
    }
}, deleteStockRequisition);

export default router;