import { z, registry } from "../infra/config/openapi";
import { ProductCategory } from "../infra/entities/product-category.entity";

// ============ Schemas ============

export const productCategoryIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const productCategoryQuerySchema = z.object({
    query: z.object({
        name: z.string().optional(),
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    }).default({})
});

export type ProductCategoryQueryDTO = z.infer<typeof productCategoryQuerySchema>["query"];

const CreateProductCategoryBodySchema = registry.register(
    "CreateProductCategoryDto",
    z.object({
        name: z.string().min(1, "Category name is required").openapi({ example: "Electronics" }),
        description: z.string().optional().openapi({ example: "Electronic devices" }),
        parentId: z.number().int().positive().optional().openapi({ example: 1 }),
    })
);

export const createProductCategorySchema = z.object({ body: CreateProductCategoryBodySchema });
export type CreateProductCategoryDTO = z.infer<typeof createProductCategorySchema>["body"];

const UpdateProductCategoryBodySchema = registry.register(
    "UpdateProductCategoryDto",
    z.object({
        name: z.string().min(1, "Category name cannot be empty").optional().openapi({ example: "Electronics" }),
        description: z.string().optional().openapi({ example: "Electronic devices" }),
        parentId: z.number().int().positive().nullable().optional().openapi({ example: 1 }),
    })
);

export const updateProductCategorySchema = z.object({
    params: productCategoryIdSchema.shape.params,
    body: UpdateProductCategoryBodySchema,
});
export type UpdateProductCategoryDTO = z.infer<typeof updateProductCategorySchema>["body"];

// ============ Response Schemas ============

const ProductCategoryParentSchema = registry.register(
    "ProductCategoryParentDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Electronics" }),
        description: z.string().optional().openapi({ example: "Electronic devices" }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

const ProductCategoryResponseSchema = registry.register(
    "ProductCategoryResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 2 }),
        name: z.string().openapi({ example: "Computers" }),
        description: z.string().optional().openapi({ example: "All kinds of computers" }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
        parent: ProductCategoryParentSchema.nullable().optional(),
    })
);

// ============ Route Registrations ============

registry.registerPath({
    method: "post",
    path: "/api/product-categories",
    tags: ["Product Categories"],
    summary: "Create a new product category",
    request: {
        body: { content: { "application/json": { schema: CreateProductCategoryBodySchema } } }
    },
    responses: {
        201: {
            description: "The created product category",
            content: { "application/json": { schema: ProductCategoryResponseSchema } }
        }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/product-categories",
    tags: ["Product Categories"],
    summary: "Returns the list of all product categories",
    request: {
        query: z.object({
            name: z.string().optional(),
            activeOnly: z.string().optional(),
        })
    },
    responses: {
        200: {
            description: "The list of product categories",
            content: { "application/json": { schema: z.array(ProductCategoryResponseSchema) } }
        }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/product-categories/{id}",
    tags: ["Product Categories"],
    summary: "Get a product category by id",
    request: { params: productCategoryIdSchema.shape.params },
    responses: {
        200: {
            description: "The product category",
            content: { "application/json": { schema: ProductCategoryResponseSchema } }
        },
        404: { description: "Product category not found" }
    }
});

registry.registerPath({
    method: "put",
    path: "/api/product-categories/{id}",
    tags: ["Product Categories"],
    summary: "Update a product category",
    request: {
        params: productCategoryIdSchema.shape.params,
        body: { content: { "application/json": { schema: UpdateProductCategoryBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated product category",
            content: { "application/json": { schema: ProductCategoryResponseSchema } }
        },
        404: { description: "Product category not found" }
    }
});

registry.registerPath({
    method: "delete",
    path: "/api/product-categories/{id}",
    tags: ["Product Categories"],
    summary: "Soft delete a product category",
    request: { params: productCategoryIdSchema.shape.params },
    responses: {
        200: { description: "Product category deleted successfully" }
    }
});

registry.registerPath({
    method: "patch",
    path: "/api/product-categories/{id}/restore",
    tags: ["Product Categories"],
    summary: "Restore a soft-deleted product category",
    request: { params: productCategoryIdSchema.shape.params },
    responses: {
        200: {
            description: "The restored product category",
            content: { "application/json": { schema: ProductCategoryResponseSchema } }
        },
        404: { description: "Product category not found" }
    }
});

// ============ Response DTOs for Runtime ============

export class ProductCategoryParentDTO {
    id!: number;
    name!: string;
    description?: string;
    deletedAt?: Date | null;
}

export class ProductCategoryResponseDTO {
    id!: number;
    name!: string;
    description?: string;
    deletedAt?: Date | null;
    parent?: ProductCategoryParentDTO | null;
}

export function toProductCategoryResponseDTO(entity: ProductCategory): ProductCategoryResponseDTO {
    return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        deletedAt: entity.deleted_at ?? null,
        parent: entity.parent ? {
            id: entity.parent.id,
            name: entity.parent.name,
            description: entity.parent.description,
            deletedAt: entity.parent.deleted_at ?? null,
        } : null,
    };
}

export function toProductCategoryResponseDTOList(entities: ProductCategory[]): ProductCategoryResponseDTO[] {
    return entities.map(toProductCategoryResponseDTO);
}
