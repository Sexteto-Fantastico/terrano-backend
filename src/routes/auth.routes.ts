import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middlewares/auth.middleware";
import { definePassword, forgotPassword, login, resetPassword } from "../controllers/auth.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { validateRequest } from "../middlewares/validate.middleware";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema, definePasswordSchema } from "../dtos/user.dto";

const router = Router();

router.post(Endpoints.AUTH.LOGIN, validateRequest(loginSchema), asyncHandler(login));
router.post(Endpoints.AUTH.FORGOT_PASSWORD, validateRequest(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post(Endpoints.AUTH.RESET_PASSWORD, validateRequest(resetPasswordSchema), asyncHandler(resetPassword));
router.post(Endpoints.AUTH.DEFINE_PASSWORD, authMiddleware, validateRequest(definePasswordSchema), asyncHandler(definePassword));

export default router;
