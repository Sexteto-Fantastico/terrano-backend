import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Endpoints } from "../utils/constants/endpoints";
import { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, restoreDepartment } from "../controllers/department.controller";

const router = Router();

router.get(Endpoints.DEPARTMENTS.GET_ALL, asyncHandler(getAllDepartments));
router.get(Endpoints.DEPARTMENTS.GET_BY_ID, asyncHandler(getDepartmentById));
router.post(Endpoints.DEPARTMENTS.CREATE, asyncHandler(createDepartment));
router.put(Endpoints.DEPARTMENTS.UPDATE, asyncHandler(updateDepartment));
router.delete(Endpoints.DEPARTMENTS.DELETE, asyncHandler(deleteDepartment));
router.patch(Endpoints.DEPARTMENTS.RESTORE, asyncHandler(restoreDepartment));

export default router;