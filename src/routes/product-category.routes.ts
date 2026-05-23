import { Router } from "express";
import { z } from "zod";
import { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory, restoreProductCategory } from "../controllers/product-category.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    productCategoryQuerySchema,
    CreateProductCategoryBodySchema,
    UpdateProductCategoryBodySchema,
    productCategoryIdSchema,
    ProductCategoryResponseSchema
} from "../dtos/product-category.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.PRODUCT_CATEGORIES.CREATE,
    basePath: Endpoints.PRODUCT_CATEGORIES.BASE,
    tags: ["Product Categories"],
    summary: "Create a new product category",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateProductCategoryBodySchema } } }
    },
    responses: {
        201: {
            description: "The created product category",
            content: { [ContentType.JSON]: { schema: ProductCategoryResponseSchema } }
        }
    }
}, createProductCategory);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCT_CATEGORIES.GET_ALL,
    basePath: Endpoints.PRODUCT_CATEGORIES.BASE,
    tags: ["Product Categories"],
    summary: "Returns the list of all product categories",
    request: {
        query: productCategoryQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of product categories",
            content: { [ContentType.JSON]: { schema: z.array(ProductCategoryResponseSchema) } }
        }
    },
}, getAllProductCategories);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.PRODUCT_CATEGORIES.GET_BY_ID,
    basePath: Endpoints.PRODUCT_CATEGORIES.BASE,
    tags: ["Product Categories"],
    summary: "Get a product category by id",
    request: {
        params: productCategoryIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The product category",
            content: { [ContentType.JSON]: { schema: ProductCategoryResponseSchema } }
        },
        404: { description: "Product category not found" }
    }
}, getProductCategoryById);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.PRODUCT_CATEGORIES.UPDATE,
    basePath: Endpoints.PRODUCT_CATEGORIES.BASE,
    tags: ["Product Categories"],
    summary: "Update a product category",
    request: {
        params: productCategoryIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateProductCategoryBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated product category",
            content: { [ContentType.JSON]: { schema: ProductCategoryResponseSchema } }
        },
        404: { description: "Product category not found" }
    }
}, updateProductCategory);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.PRODUCT_CATEGORIES.DELETE,
    basePath: Endpoints.PRODUCT_CATEGORIES.BASE,
    tags: ["Product Categories"],
    summary: "Soft delete a product category",
    request: {
        params: productCategoryIdSchema.shape.params
    },
    responses: {
        200: { description: "Product category deleted successfully" }
    }
}, deleteProductCategory);

createRoute(router, {
    method: HttpMethod.PATCH,
    path: Endpoints.PRODUCT_CATEGORIES.RESTORE,
    basePath: Endpoints.PRODUCT_CATEGORIES.BASE,
    tags: ["Product Categories"],
    summary: "Restore a soft-deleted product category",
    request: {
        params: productCategoryIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The restored product category",
            content: { [ContentType.JSON]: { schema: ProductCategoryResponseSchema } }
        },
        404: { description: "Product category not found" }
    }
}, restoreProductCategory);

export default router;
