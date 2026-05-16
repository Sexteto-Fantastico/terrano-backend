import { Router } from "express";
import { getAll, getById, create, update, remove, restore } from "../controllers/measurement-unit.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { createMeasurementUnitSchema, updateMeasurementUnitSchema, measurementUnitIdSchema, measurementUnitQuerySchema } from "../dtos/measurement-unit.dto";

const router = Router();

router.get(Endpoints.MEASUREMENT_UNITS.GET_ALL, validateRequest(measurementUnitQuerySchema), paginationMiddleware, asyncHandler(getAll));
router.get(Endpoints.MEASUREMENT_UNITS.GET_BY_ID, validateRequest(measurementUnitIdSchema), asyncHandler(getById));
router.post(Endpoints.MEASUREMENT_UNITS.CREATE, validateRequest(createMeasurementUnitSchema), asyncHandler(create));
router.put(Endpoints.MEASUREMENT_UNITS.UPDATE, validateRequest(updateMeasurementUnitSchema), asyncHandler(update));
router.delete(Endpoints.MEASUREMENT_UNITS.DELETE, validateRequest(measurementUnitIdSchema), asyncHandler(remove));
router.post(Endpoints.MEASUREMENT_UNITS.RESTORE, validateRequest(measurementUnitIdSchema), asyncHandler(restore));

export default router;
