import { Router } from "express";
import { z } from "zod";
import {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    restoreSupplier
} from "../controllers/supplier.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    SupplierQuerySchema,
    CreateSupplierBodySchema,
    UpdateSupplierBodySchema,
    SupplierIdSchema,
    SupplierResponseSchema,
} from "../dtos/supplier.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.SUPPLIERS.CREATE,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Create a new supplier",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateSupplierBodySchema } } }
    },
    responses: {
        201: {
            description: "The created supplier",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        },
        400: { description: "Validation error" }
    },
    permissions: { resource: "SUPPLIER", action: "CREATE" },
}, createSupplier);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.SUPPLIERS.GET_ALL,
    permissions: { resource: "SUPPLIER", action: "READ" },
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Returns the list of suppliers",
    description: "Supports pagination, sorting, activeOnly, and name filtering. Each item includes isActive derived from deleted_at.",
    request: {
        query: SupplierQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of suppliers",
            content: { [ContentType.JSON]: { schema: z.array(SupplierResponseSchema) } }
        }
    },
}, getAllSuppliers);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.SUPPLIERS.GET_BY_ID,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Get a supplier by id",
    request: {
        params: SupplierIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The supplier",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        },
        404: { description: "Supplier not found" }
    },
    permissions: { resource: "SUPPLIER", action: "READ" },
}, getSupplierById);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.SUPPLIERS.UPDATE,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Update an existing supplier",
    request: {
        params: SupplierIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateSupplierBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated supplier",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        },
        404: { description: "Supplier not found" }
    },
    permissions: { resource: "SUPPLIER", action: "UPDATE" },
}, updateSupplier);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.SUPPLIERS.DELETE,
    permissions: { resource: "SUPPLIER", action: "DELETE" },
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Soft delete a supplier",
    request: {
        params: SupplierIdSchema.shape.params
    },
    responses: {
        204: { description: "Supplier deleted successfully" },
        404: { description: "Supplier not found" }
    },
}, deleteSupplier);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.SUPPLIERS.RESTORE,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Restore a soft-deleted supplier",
    request: {
        params: SupplierIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The restored supplier",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        },
        400: { description: "Supplier is not deleted" },
        404: { description: "Supplier not found" }
    },
    permissions: { resource: "SUPPLIER", action: "UPDATE" },
}, restoreSupplier);

export default router;