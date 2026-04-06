import { Router } from "express";
import { DepartmentController } from "../controllers/department.controller";
import { Endpoints } from "../utils/constants/endpoints";

const router = Router();

router.post(Endpoints.DEPARTMENTS.CREATE, DepartmentController.create);
router.get(Endpoints.DEPARTMENTS.GET_ALL, DepartmentController.getAll);
router.get(Endpoints.DEPARTMENTS.GET_BY_ID, DepartmentController.getById);
router.put(Endpoints.DEPARTMENTS.UPDATE, DepartmentController.update);
router.delete(Endpoints.DEPARTMENTS.DELETE, DepartmentController.delete);
router.post(Endpoints.DEPARTMENTS.RESTORE, DepartmentController.restore);

export default router;