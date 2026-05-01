import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middlewares/auth.middleware";
import { definePassword, forgotPassword, login, resetPassword } from "../controllers/auth.controller";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and password recovery
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestDto'
 *     responses:
 *       200:
 *         description: Login response with bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponseDto'
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", asyncHandler(login));

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request a password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequestDto'
 *     responses:
 *       200:
 *         description: Password reset email queued or logged
 */
router.post("/forgot-password", asyncHandler(forgotPassword));

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password using token from email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequestDto'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 */
router.post("/reset-password", asyncHandler(resetPassword));

/**
 * @openapi
 * /api/auth/define-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Define or change password for the logged in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DefinePasswordRequestDto'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/define-password", authMiddleware, asyncHandler(definePassword));

export default router;
