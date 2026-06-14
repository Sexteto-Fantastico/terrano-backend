import { Router } from "express";
import { z } from "zod";
import { createProductBrand, getAllProductBrands, getProductBrandById, updateProductBrand, deleteProductBrand, restoreProductBrand } from "../controllers/product-brand.controller";
import { getProductBrandLogs } from "../controllers/system-log.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    ProductBrandQuerySchema,
    CreateProductBrandBodySchema,
    UpdateProductBrandBodySchema,
    ProductBrandIdSchema,
    ProductBrandResponseSchema
} from "../dtos/product-brand.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.PRODUCT_BRANDS.CREATE,
    basePath: Endpoints.PRODUCT_BRANDS.BASE,
    tags: ["Product Brands"],
    summary: "Create a new product brand",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateProductBrandBodySchema } } }
    },
    responses: {
        201: {
            description: "The created product brand",
            content: { [ContentType.JSON]: { schema: ProductBrandResponseSchema } }
        }
    },
    permissions: { resource: "PRODUCT_BRAND", action: "CREATE" },
}, createProductBrand);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCT_BRANDS.GET_ALL,
    permissions: { resource: "PRODUCT_BRAND", action: "READ" },
    basePath: Endpoints.PRODUCT_BRANDS.BASE,
    tags: ["Product Brands"],
    summary: "Returns the list of all product brands",
    request: {
        query: ProductBrandQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of product brands",
            content: { [ContentType.JSON]: { schema: z.array(ProductBrandResponseSchema) } }
        }
    },
}, getAllProductBrands);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCT_BRANDS.GET_BY_ID,
    basePath: Endpoints.PRODUCT_BRANDS.BASE,
    tags: ["Product Brands"],
    summary: "Get a product brand by id",
    request: {
        params: ProductBrandIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The product brand",
            content: { [ContentType.JSON]: { schema: ProductBrandResponseSchema } }
        },
        404: { description: "Product brand not found" }
    },
    permissions: { resource: "PRODUCT_BRAND", action: "READ" },
}, getProductBrandById);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCT_BRANDS.GET_LOGS,
    permissions: { resource: "PRODUCT_BRAND", action: "READ" },
    basePath: Endpoints.PRODUCT_BRANDS.BASE,
    tags: ["Product Brands"],
    summary: "Get logs for a product brand",
    request: {
        params: ProductBrandIdSchema.shape.params
    },
    responses: {
        200: { description: "List of product brand logs" }
    }
}, getProductBrandLogs);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.PRODUCT_BRANDS.UPDATE,
    basePath: Endpoints.PRODUCT_BRANDS.BASE,
    tags: ["Product Brands"],
    summary: "Update a product brand",
    request: {
        params: ProductBrandIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateProductBrandBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated product brand",
            content: { [ContentType.JSON]: { schema: ProductBrandResponseSchema } }
        },
        404: { description: "Product brand not found" }
    },
    permissions: { resource: "PRODUCT_BRAND", action: "UPDATE" },
}, updateProductBrand);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.PRODUCT_BRANDS.DELETE,
    permissions: { resource: "PRODUCT_BRAND", action: "DELETE" },
    basePath: Endpoints.PRODUCT_BRANDS.BASE,
    tags: ["Product Brands"],
    summary: "Soft delete a product brand",
    request: {
        params: ProductBrandIdSchema.shape.params
    },
    responses: {
        204: { description: "Product brand deleted successfully" }
    }
}, deleteProductBrand);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.PRODUCT_BRANDS.RESTORE,
    basePath: Endpoints.PRODUCT_BRANDS.BASE,
    tags: ["Product Brands"],
    summary: "Restore a soft-deleted product brand",
    request: {
        params: ProductBrandIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The restored product brand",
            content: { [ContentType.JSON]: { schema: ProductBrandResponseSchema } }
        },
        404: { description: "Product brand not found" }
    },
    permissions: { resource: "PRODUCT_BRAND", action: "UPDATE" },
}, restoreProductBrand);

export default router;