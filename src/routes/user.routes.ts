import { Router } from "express";
import { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, restoreUser } from "../controllers/user.controller";
import { asyncHandler } from "../utils/async-handler";
import { Endpoints } from "../utils/constants/endpoints";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { getUserLogs } from "../controllers/system-log.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import { createUserSchema, getUsersQuerySchema, userIdParamsSchema, updateUserSchema, changePasswordSchema, deleteUserSchema, restoreUserSchema } from "../dtos/user.dto";

const router = Router();

router.post(Endpoints.USERS.CREATE, validateRequest(createUserSchema), asyncHandler(createUser));
router.get(Endpoints.USERS.GET_ALL, validateRequest(getUsersQuerySchema), paginationMiddleware, asyncHandler(getUsers));
router.get(Endpoints.USERS.GET_BY_ID, validateRequest(userIdParamsSchema), asyncHandler(getUserById));
router.get("/:id/logs", validateRequest(userIdParamsSchema), asyncHandler(getUserLogs));
router.put(Endpoints.USERS.CHANGE_PASSWORD, validateRequest(changePasswordSchema), asyncHandler(changePassword));
router.put(Endpoints.USERS.UPDATE, validateRequest(updateUserSchema), asyncHandler(updateUser));
router.delete(Endpoints.USERS.DELETE, validateRequest(deleteUserSchema), asyncHandler(deleteUser));
router.post(Endpoints.USERS.RESTORE, validateRequest(restoreUserSchema), asyncHandler(restoreUser));

export default router;
