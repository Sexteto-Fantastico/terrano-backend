import { Router } from "express";
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    restoreDepartment
} from "../controllers/department.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { createDepartmentSchema, updateDepartmentSchema, departmentIdSchema, departmentQuerySchema } from "../dtos/department.dto";

const router = Router();

router.post(Endpoints.DEPARTMENTS.CREATE, validateRequest(createDepartmentSchema), asyncHandler(createDepartment));
router.get(Endpoints.DEPARTMENTS.GET_ALL, validateRequest(departmentQuerySchema), paginationMiddleware, asyncHandler(getAllDepartments));
router.get(Endpoints.DEPARTMENTS.GET_BY_ID, validateRequest(departmentIdSchema), asyncHandler(getDepartmentById));
router.put(Endpoints.DEPARTMENTS.UPDATE, validateRequest(updateDepartmentSchema), asyncHandler(updateDepartment));
router.delete(Endpoints.DEPARTMENTS.DELETE, validateRequest(departmentIdSchema), asyncHandler(deleteDepartment));
router.patch(Endpoints.DEPARTMENTS.RESTORE, validateRequest(departmentIdSchema), asyncHandler(restoreDepartment));

export default router;