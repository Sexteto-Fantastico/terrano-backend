import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Endpoints } from "../utils/constants/endpoints";
import { DepartmentController } from "../controllers/department.controller";
import DepartmentService from "../services/department.service";
import { DepartmentRepository } from "../repositories/department.repository";

export function setupDepartmentRoutes() {
    const router = Router();

    const departmentRepository = new DepartmentRepository();
    const departmentService = new DepartmentService(departmentRepository);
    const departmentController = new DepartmentController(departmentService);

    router.get(Endpoints.DEPARTMENTS.GET_ALL, asyncHandler(departmentController.getAllDepartments.bind(departmentController)));
    router.get(Endpoints.DEPARTMENTS.GET_BY_ID, asyncHandler(departmentController.getDepartmentById.bind(departmentController)));
    router.post(Endpoints.DEPARTMENTS.CREATE, asyncHandler(departmentController.createDepartment.bind(departmentController)));
    router.put(Endpoints.DEPARTMENTS.UPDATE, asyncHandler(departmentController.updateDepartment.bind(departmentController)));
    router.delete(Endpoints.DEPARTMENTS.DELETE, asyncHandler(departmentController.deleteDepartment.bind(departmentController)));
    router.patch(Endpoints.DEPARTMENTS.RESTORE, asyncHandler(departmentController.restoreDepartment.bind(departmentController)));

    return router;
}