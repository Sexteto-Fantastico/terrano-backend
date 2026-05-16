import { z, registry } from "../infra/config/openapi";
import { ProductCategoryResponseDTO, toProductCategoryResponseDTO } from "./product-category.dto";
import { Product } from "../infra/entities/product.entity";
import { MeasurementUnitResponseDto, toMeasurementUnitResponseDto } from "./measurement-unit.dto";
import { ProductBrandResponseDTO, toProductBrandResponseDTO } from "./product-brand.dto";

// ============ Response Schema (for OpenAPI docs only) ============

const ProductResponseSchema = registry.register(
    "ProductResponseDTO",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Steel Rod 12mm" }),
        code: z.string().openapi({ example: "PROD-001" }),
        description: z.string().nullable().optional().openapi({ example: "High quality steel rod" }),
        category: z.object({
            id: z.number().int().openapi({ example: 1 }),
            name: z.string().openapi({ example: "Category" }),
            description: z.string().nullable().optional().openapi({ example: "Description" }),
            deletedAt: z.string().nullable().optional().openapi({ example: null }),
            parent: z.object({
                id: z.number().int().openapi({ example: 1 }),
                name: z.string(),
                description: z.string().nullable().optional(),
                deletedAt: z.string().nullable().optional(),
            }).nullable().optional(),
        }).openapi({ description: "Product category" }),
        measurementUnit: z.object({
            id: z.number().int().openapi({ example: 1 }),
            name: z.string().openapi({ example: "Kilogram" }),
            symbol: z.string().openapi({ example: "kg" }),
            type: z.string().openapi({ example: "Weight" }),
            deletedAt: z.string().nullable().optional().openapi({ example: null }),
        }).openapi({ description: "Measurement unit" }),
        brand: z.object({
            id: z.number().int().openapi({ example: 1 }),
            name: z.string().openapi({ example: "Brand" }),
            isActive: z.boolean().optional().openapi({ example: true }),
            deletedAt: z.string().nullable().optional().openapi({ example: null }),
        }).openapi({ description: "Product brand" }),
        minStock: z.number().int().nullable().optional().openapi({ example: 10 }),
        maxStock: z.number().int().nullable().optional().openapi({ example: 100 }),
        deletedAt: z.string().nullable().openapi({ example: null }),
    })
);

// ============ Input Schemas ============

export const productQuerySchema = z.object({
    query: z.object({
        name: z.string().optional(),
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
        brandId: z.coerce.number().int().positive().optional(),
        categoryId: z.coerce.number().int().positive().optional(),
        code: z.string().optional(),
    }).default({})
});

export type ProductQueryDTO = z.infer<typeof productQuerySchema>["query"];

const CreateProductBodySchema = registry.register(
    "CreateProductRequestDTO",
    z.object({
        name: z.string().min(1, "Product name is required").openapi({ example: "Steel Rod 12mm" }),
        code: z.string().min(1, "Product code is required").openapi({ example: "PROD-001" }),
        description: z.string().optional().openapi({ example: "High quality steel rod" }),
        categoryId: z.number().int().positive("Category ID is required").openapi({ example: 1 }),
        measurementUnitId: z.number().int().positive("Measurement Unit ID is required").openapi({ example: 1 }),
        brandId: z.number().int().positive("Brand ID is required").openapi({ example: 1 }),
        minStock: z.number().int().nonnegative("Minimum stock cannot be negative").optional().openapi({ example: 10 }),
        maxStock: z.number().int().nonnegative("Maximum stock cannot be negative").optional().openapi({ example: 100 }),
    })
);

export const createProductSchema = z.object({
    body: CreateProductBodySchema,
});

export type CreateProductRequestDTO = z.infer<typeof createProductSchema>["body"];

const UpdateProductBodySchema = registry.register(
    "ProductUpdateRequestDTO",
    z.object({
        name: z.string().min(1, "Product name cannot be empty").optional().openapi({ example: "Updated Steel Rod" }),
        code: z.string().min(1, "Product code cannot be empty").optional().openapi({ example: "PROD-002" }),
        description: z.string().optional().openapi({ example: "Updated description" }),
        categoryId: z.number().int().positive().optional().openapi({ example: 2 }),
        measurementUnitId: z.number().int().positive().optional().openapi({ example: 2 }),
        brandId: z.number().int().positive().optional().openapi({ example: 2 }),
        minStock: z.number().int().nonnegative("Minimum stock cannot be negative").optional().openapi({ example: 5 }),
        maxStock: z.number().int().nonnegative("Maximum stock cannot be negative").optional().openapi({ example: 50 }),
    })
);

export const updateProductSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    }),
    body: UpdateProductBodySchema,
});

export type ProductUpdateRequestDTO = z.infer<typeof updateProductSchema>["body"] & z.infer<typeof updateProductSchema>["params"];

export const productIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

// ============ Route Registrations ============

registry.registerPath({
    method: "post",
    path: "/api/products",
    tags: ["Products"],
    summary: "Create a new product",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateProductBodySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "The created product",
            content: {
                "application/json": {
                    schema: ProductResponseSchema,
                },
            },
        },
        400: { description: "Validation error" },
    },
});

registry.registerPath({
    method: "get",
    path: "/api/products",
    tags: ["Products"],
    summary: "Returns the list of all products",
    request: {
        query: z.object({
            name: z.string().optional(),
            activeOnly: z.string().optional(),
            brandId: z.coerce.number().int().optional(),
            categoryId: z.coerce.number().int().optional(),
            code: z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: "The list of products",
            content: {
                "application/json": {
                    schema: z.array(ProductResponseSchema),
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/api/products/{id}",
    tags: ["Products"],
    summary: "Get a product by id",
    request: {
        params: z.object({
            id: z.coerce.number().int(),
        }),
    },
    responses: {
        200: {
            description: "The product",
            content: {
                "application/json": {
                    schema: ProductResponseSchema,
                },
            },
        },
        404: { description: "Product not found" },
    },
});

registry.registerPath({
    method: "put",
    path: "/api/products/{id}",
    tags: ["Products"],
    summary: "Update a product",
    request: {
        params: z.object({
            id: z.coerce.number().int(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: UpdateProductBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "The updated product",
            content: {
                "application/json": {
                    schema: ProductResponseSchema,
                },
            },
        },
        404: { description: "Product not found" },
    },
});

registry.registerPath({
    method: "delete",
    path: "/api/products/{id}",
    tags: ["Products"],
    summary: "Delete a product",
    request: {
        params: z.object({
            id: z.coerce.number().int(),
        }),
    },
    responses: {
        200: { description: "Product deleted successfully" },
        404: { description: "Product not found" },
    },
});

registry.registerPath({
    method: "post",
    path: "/api/products/{id}/restore",
    tags: ["Products"],
    summary: "Restore a deleted product",
    request: {
        params: z.object({
            id: z.coerce.number().int(),
        }),
    },
    responses: {
        200: {
            description: "Product restored successfully",
            content: {
                "application/json": {
                    schema: ProductResponseSchema,
                },
            },
        },
        400: { description: "Product is not deleted" },
        404: { description: "Product not found" },
    },
});

// ============ Response DTO (Runtime) ============

export class ProductResponseDTO {
    id: number;
    name: string;
    code: string;
    description?: string;
    category: ProductCategoryResponseDTO;
    measurementUnit: MeasurementUnitResponseDto;
    brand: ProductBrandResponseDTO;
    minStock?: number;
    maxStock?: number;
    deletedAt: Date | null;
}

export function toProductResponseDTO(entity: Product): ProductResponseDTO {
    return {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        description: entity.description,
        category: toProductCategoryResponseDTO(entity.category),
        measurementUnit: toMeasurementUnitResponseDto(entity.measurement_unit),
        brand: toProductBrandResponseDTO(entity.brand),
        minStock: entity.min_stock,
        maxStock: entity.max_stock,
        deletedAt: entity.deleted_at ?? null,
    };
}
