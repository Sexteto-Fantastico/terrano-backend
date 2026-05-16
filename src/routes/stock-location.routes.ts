import { Router } from "express";
import {
    createStockLocation,
    getAllStockLocations,
    getStockLocationById,
    updateStockLocation,
    deleteStockLocation,
    restoreStockLocation
} from "../controllers/stock-location.controller";
import { getStockLocationLogs } from "../controllers/system-log.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { createStockLocationSchema, updateStockLocationSchema, stockLocationIdSchema, stockLocationQuerySchema } from "../dtos/stock-location.dto";

const router = Router();

router.post(Endpoints.STOCK_LOCATIONS.CREATE, validateRequest(createStockLocationSchema), asyncHandler(createStockLocation));
router.get(Endpoints.STOCK_LOCATIONS.GET_ALL, validateRequest(stockLocationQuerySchema), paginationMiddleware, asyncHandler(getAllStockLocations));
router.get(Endpoints.STOCK_LOCATIONS.GET_BY_ID, validateRequest(stockLocationIdSchema), asyncHandler(getStockLocationById));
router.get("/:id/logs", validateRequest(stockLocationIdSchema), asyncHandler(getStockLocationLogs));
router.put(Endpoints.STOCK_LOCATIONS.UPDATE, validateRequest(updateStockLocationSchema), asyncHandler(updateStockLocation));
router.delete(Endpoints.STOCK_LOCATIONS.DELETE, validateRequest(stockLocationIdSchema), asyncHandler(deleteStockLocation));
router.patch(Endpoints.STOCK_LOCATIONS.RESTORE, validateRequest(stockLocationIdSchema), asyncHandler(restoreStockLocation));

export default router;