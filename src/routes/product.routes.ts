import { Router } from "express";
import { z } from "zod";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { getProductLogs } from "../controllers/system-log.controller";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, restoreProduct } from "../controllers/product.controller";
import { createRoute } from "../utils/route-builder";
import {
    ProductQuerySchema,
    CreateProductBodySchema,
    UpdateProductBodySchema,
    ProductIdSchema,
    ProductResponseSchema
} from "../dtos/product.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.PRODUCTS.CREATE,
    basePath: Endpoints.PRODUCTS.BASE,
    tags: ["Products"],
    summary: "Create a new product",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateProductBodySchema } } }
    },
    responses: {
        201: {
            description: "The created product",
            content: { [ContentType.JSON]: { schema: ProductResponseSchema } }
        },
        400: { description: "Validation error" }
    }
}, createProduct);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCTS.GET_ALL,
    basePath: Endpoints.PRODUCTS.BASE,
    tags: ["Products"],
    summary: "Returns the list of all products",
    request: {
        query: ProductQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of products",
            content: { [ContentType.JSON]: { schema: z.array(ProductResponseSchema) } }
        }
    },
}, getAllProducts);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCTS.GET_BY_ID,
    basePath: Endpoints.PRODUCTS.BASE,
    tags: ["Products"],
    summary: "Get a product by id",
    request: {
        params: ProductIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The product",
            content: { [ContentType.JSON]: { schema: ProductResponseSchema } }
        },
        404: { description: "Product not found" }
    }
}, getProductById);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCTS.GET_LOGS,
    basePath: Endpoints.PRODUCTS.BASE,
    tags: ["Products"],
    summary: "Get logs for a product",
    request: {
        params: ProductIdSchema.shape.params
    },
    responses: {
        200: { description: "List of product logs" }
    }
}, getProductLogs);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.PRODUCTS.UPDATE,
    basePath: Endpoints.PRODUCTS.BASE,
    tags: ["Products"],
    summary: "Update a product",
    request: {
        params: ProductIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateProductBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated product",
            content: { [ContentType.JSON]: { schema: ProductResponseSchema } }
        },
        404: { description: "Product not found" }
    }
}, updateProduct);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.PRODUCTS.DELETE,
    basePath: Endpoints.PRODUCTS.BASE,
    tags: ["Products"],
    summary: "Delete a product",
    request: {
        params: ProductIdSchema.shape.params
    },
    responses: {
        204: { description: "Product deleted successfully" },
        404: { description: "Product not found" }
    }
}, deleteProduct);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.PRODUCTS.RESTORE,
    basePath: Endpoints.PRODUCTS.BASE,
    tags: ["Products"],
    summary: "Restore a deleted product",
    request: {
        params: ProductIdSchema.shape.params
    },
    responses: {
        200: {
            description: "Product restored successfully",
            content: { [ContentType.JSON]: { schema: ProductResponseSchema } }
        },
        400: { description: "Product is not deleted" },
        404: { description: "Product not found" }
    }
}, restoreProduct);

export default router;