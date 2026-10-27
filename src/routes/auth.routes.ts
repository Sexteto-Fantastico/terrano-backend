import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { definePassword, forgotPassword, getMe, login, logout, refresh, resetPassword } from "../controllers/auth.controller";
import { requireTrustedOrigin } from "../middlewares/csrf-origin.middleware";
import { forgotPasswordRateLimit, loginRateLimit, refreshRateLimit, resetPasswordRateLimit } from "../middlewares/rate-limit.middleware";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    LoginBodySchema,
    LoginResponseSchema,
    ForgotPasswordBodySchema,
    ResetPasswordBodySchema,
    DefinePasswordBodySchema,
    MeResponseSchema
} from "../dtos/auth.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.AUTH.LOGIN,
    basePath: Endpoints.AUTH.BASE,
    tags: ["Auth"],
    summary: "Log in with email and password",
    request: {
        body: { content: { [ContentType.JSON]: { schema: LoginBodySchema } } }
    },
    responses: {
        200: {
            description: "Login response with bearer token",
            content: { [ContentType.JSON]: { schema: LoginResponseSchema } }
        },
        401: { description: "Invalid credentials" },
        429: { description: "Too many attempts" }
    },
    middlewares: [loginRateLimit]
}, login);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.AUTH.REFRESH,
    basePath: Endpoints.AUTH.BASE,
    tags: ["Auth"],
    summary: "Rotate the refresh token (httpOnly cookie) and issue a new access token",
    responses: {
        200: {
            description: "New access token; the refresh cookie is rotated",
            content: { [ContentType.JSON]: { schema: LoginResponseSchema } }
        },
        401: { description: "Missing, invalid or expired refresh token" }
    },
    middlewares: [refreshRateLimit, requireTrustedOrigin]
}, refresh);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.AUTH.LOGOUT,
    basePath: Endpoints.AUTH.BASE,
    tags: ["Auth"],
    summary: "Revoke the current refresh token and clear the cookie",
    responses: {
        204: { description: "Logged out" }
    },
    middlewares: [requireTrustedOrigin]
}, logout);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.AUTH.FORGOT_PASSWORD,
    basePath: Endpoints.AUTH.BASE,
    tags: ["Auth"],
    summary: "Request a password reset link",
    request: {
        body: { content: { [ContentType.JSON]: { schema: ForgotPasswordBodySchema } } }
    },
    responses: {
        200: { description: "Password reset email queued or logged" },
        429: { description: "Too many attempts" }
    },
    middlewares: [forgotPasswordRateLimit]
}, forgotPassword);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.AUTH.RESET_PASSWORD,
    basePath: Endpoints.AUTH.BASE,
    tags: ["Auth"],
    summary: "Reset password using token from email",
    request: {
        body: { content: { [ContentType.JSON]: { schema: ResetPasswordBodySchema } } }
    },
    responses: {
        200: { description: "Password reset successfully" },
        400: { description: "Invalid or expired reset token" },
        429: { description: "Too many attempts" }
    },
    middlewares: [resetPasswordRateLimit]
}, resetPassword);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.AUTH.DEFINE_PASSWORD,
    basePath: Endpoints.AUTH.BASE,
    tags: ["Auth"],
    summary: "Define (first access) or change (requires currentPassword) the password of the logged in user",
    security: [{ bearerAuth: [] }],
    request: {
        body: { content: { [ContentType.JSON]: { schema: DefinePasswordBodySchema } } }
    },
    responses: {
        200: { description: "Password updated successfully" },
        401: { description: "Unauthorized" }
    },
    middlewares: [authMiddleware]
}, definePassword);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.AUTH.ME,
    basePath: Endpoints.AUTH.BASE,
    tags: ["Auth"],
    summary: "Get current logged-in user profile",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "Current user profile",
            content: { [ContentType.JSON]: { schema: MeResponseSchema } }
        },
        401: { description: "Unauthorized" }
    },
    middlewares: [authMiddleware]
}, getMe);

export default router;
