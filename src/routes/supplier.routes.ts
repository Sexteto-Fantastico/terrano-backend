import { Router } from "express";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import { z } from "zod";
import {
    SupplierIdSchema,
    SupplierQuerySchema,
    createSupplierSchema,
    updateSupplierSchema,
    SupplierResponseSchema
} from "../dtos/supplier.dto";
import { 
    getAllSuppliers, 
    getSupplierById, 
    createSupplier, 
    updateSupplier, 
    deleteSupplier, 
    restoreSupplier 
} from "../controllers/supplier.controller";

const router = Router();

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.SUPPLIERS.GET_ALL,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Returns the list of all suppliers",
    request: {
        query: SupplierQuerySchema.shape.query,
    },
    responses: {
        200: { 
            description: "The list of suppliers",
            content: {
                [ContentType.JSON]: { schema: z.array(SupplierResponseSchema) }
            }
        },
    },
    permissions: { resource: "SUPPLIER", action: "READ" },
}, getAllSuppliers);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.SUPPLIERS.GET_BY_ID,
    permissions: { resource: "SUPPLIER", action: "READ" },
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Get a supplier by id",
    request: { params: SupplierIdSchema.shape.params },
    responses: { 
        200: { 
            description: "The supplier details",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        }, 
        404: { description: "Supplier not found" } 
    },
}, getSupplierById);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.SUPPLIERS.CREATE,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Create a new supplier",
    request: { body: { content: { [ContentType.JSON]: { schema: createSupplierSchema } } } },
    responses: { 
        201: { 
            description: "Supplier created successfully",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        }, 
        400: { description: "Validation error" } 
    },
    permissions: { resource: "SUPPLIER", action: "CREATE" },
}, createSupplier);

createRoute(router, {
    method: HttpMethod.PUT,
    permissions: { resource: "SUPPLIER", action: "UPDATE" },
    path: Endpoints.SUPPLIERS.UPDATE,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Update an existing supplier",
    request: { 
        params: SupplierIdSchema.shape.params, 
        body: { content: { [ContentType.JSON]: { schema: updateSupplierSchema } } } 
    },
    responses: { 
        200: { 
            description: "Supplier updated successfully",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        }, 
        404: { description: "Supplier not found" } 
    },
}, updateSupplier);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.SUPPLIERS.DELETE,
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Delete a supplier",
    request: { params: SupplierIdSchema.shape.params },
    responses: { 
        204: { description: "Supplier deleted successfully" }, 
        404: { description: "Supplier not found" } 
    },
    permissions: { resource: "SUPPLIER", action: "DELETE" },
}, deleteSupplier);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.SUPPLIERS.RESTORE,
    permissions: { resource: "SUPPLIER", action: "UPDATE" },
    basePath: Endpoints.SUPPLIERS.BASE,
    tags: ["Suppliers"],
    summary: "Restore a deleted supplier",
    request: { params: SupplierIdSchema.shape.params },
    responses: { 
        200: { 
            description: "Supplier restored successfully",
            content: { [ContentType.JSON]: { schema: SupplierResponseSchema } }
        }, 
        400: { description: "Supplier is not deleted" }, 
        404: { description: "Supplier not found" } 
    },
}, restoreSupplier);

export default router;