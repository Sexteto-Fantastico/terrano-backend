import { Router } from "express";
import { createRoute } from "../utils/route-builder";
import { HttpMethod, ContentType, Endpoints } from "../utils/constants/endpoints";
import { z } from "../infra/config/openapi";
import {
    createAlert,
    getAllAlerts,
    getAlertById,
    updateAlert,
    deleteAlert,
    restoreAlert,
    checkLowStockAlerts,
} from "../controllers/alert.controller";
import {
    AlertQuerySchema,
    CreateAlertBodySchema,
    UpdateAlertBodySchema,
    AlertIdSchema,
    AlertResponseSchema,
} from "../dtos/alert.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.ALERTS.CREATE,
    basePath: Endpoints.ALERTS.BASE,
    tags: ["Alerts"],
    summary: "Create a new alert",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateAlertBodySchema } } },
    },
    responses: {
        201: {
            description: "The created alert",
            content: { [ContentType.JSON]: { schema: AlertResponseSchema } },
        },
    },
    permissions: { resource: "ALERT", action: "CREATE" },
}, createAlert);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.ALERTS.GET_ALL,
    basePath: Endpoints.ALERTS.BASE,
    tags: ["Alerts"],
    summary: "Returns the list of alerts",
    request: { query: AlertQuerySchema.shape.query },
    responses: {
        200: {
            description: "List of alerts",
            content: { [ContentType.JSON]: { schema: z.array(AlertResponseSchema) } },
        },
    },
    permissions: { resource: "ALERT", action: "READ" },
}, getAllAlerts);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.ALERTS.GET_BY_ID,
    basePath: Endpoints.ALERTS.BASE,
    tags: ["Alerts"],
    summary: "Get alert by id",
    request: { params: AlertIdSchema.shape.params },
    responses: {
        200: {
            description: "The alert",
            content: { [ContentType.JSON]: { schema: AlertResponseSchema } },
        },
    },
    permissions: { resource: "ALERT", action: "READ" },
}, getAlertById);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.ALERTS.UPDATE,
    basePath: Endpoints.ALERTS.BASE,
    tags: ["Alerts"],
    summary: "Update alert",
    request: {
        params: AlertIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateAlertBodySchema } } },
    },
    responses: {
        200: {
            description: "The updated alert",
            content: { [ContentType.JSON]: { schema: AlertResponseSchema } },
        },
    },
    permissions: { resource: "ALERT", action: "UPDATE" },
}, updateAlert);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.ALERTS.DELETE,
    basePath: Endpoints.ALERTS.BASE,
    tags: ["Alerts"],
    summary: "Delete alert",
    request: { params: AlertIdSchema.shape.params },
    responses: { 204: { description: "Alert deleted successfully" } },
    permissions: { resource: "ALERT", action: "DELETE" },
}, deleteAlert);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.ALERTS.RESTORE,
    basePath: Endpoints.ALERTS.BASE,
    tags: ["Alerts"],
    summary: "Restore alert",
    request: { params: AlertIdSchema.shape.params },
    responses: {
        200: {
            description: "The restored alert",
            content: { [ContentType.JSON]: { schema: AlertResponseSchema } },
        },
    },
    permissions: { resource: "ALERT", action: "UPDATE" },
}, restoreAlert);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.ALERTS.CHECK_STOCK,
    basePath: Endpoints.ALERTS.BASE,
    tags: ["Alerts"],
    summary: "Check all low-stock alerts",
    responses: {
        200: { description: "Alert evaluation finished" },
    },
    permissions: { resource: "ALERT", action: "READ" },
}, checkLowStockAlerts);

export default router;
