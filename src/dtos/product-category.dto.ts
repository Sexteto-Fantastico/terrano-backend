import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";
import { ProductCategory } from "../infra/entities/product-category.entity";

export const ProductCategoryIdSchema = idParamSchema;

export const ProductCategoryQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});

export type ProductCategoryQuery = z.infer<typeof ProductCategoryQuerySchema>["query"];

export const CreateProductCategoryBodySchema = registry.register(
    "CreateProductCategory",
    z.object({
        name: z.string().min(1, "Category name is required").openapi({ example: "Electronics" }),
        description: z.string().optional().openapi({ example: "Electronic devices" }),
        parentId: z.number().int().positive().optional().openapi({ example: 1 }),
    })
);

export const createProductCategorySchema = z.object({ body: CreateProductCategoryBodySchema });
export type CreateProductCategory = z.infer<typeof createProductCategorySchema>["body"];

export const UpdateProductCategoryBodySchema = registry.register(
    "UpdateProductCategory",
    z.object({
        name: z.string().min(1, "Category name cannot be empty").optional().openapi({ example: "Electronics" }),
        description: z.string().optional().openapi({ example: "Electronic devices" }),
        parentId: z.number().int().positive().nullable().optional().openapi({ example: 1 }),
    })
);

export const updateProductCategorySchema = z.object({
    params: ProductCategoryIdSchema.shape.params,
    body: UpdateProductCategoryBodySchema,
});
export type UpdateProductCategory = z.infer<typeof updateProductCategorySchema>["body"];

export const ProductCategoryParentSchema = registry.register(
    "ProductCategoryParent",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Electronics" }),
        description: z.string().optional().openapi({ example: "Electronic devices" }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

export const ProductCategoryResponseSchema = registry.register(
    "ProductCategoryResponse",
    z.object({
        id: z.number().int().openapi({ example: 2 }),
        name: z.string().openapi({ example: "Computers" }),
        description: z.string().optional().openapi({ example: "All kinds of computers" }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
        parent: ProductCategoryParentSchema.nullable().optional(),
    })
);

export type ProductCategoryParent = z.infer<typeof ProductCategoryParentSchema>;

export type ProductCategoryResponse = z.infer<typeof ProductCategoryResponseSchema>;

export function toProductCategoryResponse(entity: ProductCategory): ProductCategoryResponse {
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

export function toProductCategoryResponseList(entities: ProductCategory[]): ProductCategoryResponse[] {
    return entities.map(toProductCategoryResponse);
}
