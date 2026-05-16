import { z, registry } from "../infra/config/openapi";

// ============ Schemas ============

export const productBrandIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const productBrandQuerySchema = z.object({
    query: z.object({
        active: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    }).default({})
});

const CreateProductBrandBodySchema = registry.register(
    "CreateProductBrandDto",
    z.object({
        name: z.string().min(1, "Brand name is required").openapi({ example: "BrandX" }),
    })
);

export const createProductBrandSchema = z.object({ body: CreateProductBrandBodySchema });
export type CreateProductBrandDTO = z.infer<typeof createProductBrandSchema>["body"];

const UpdateProductBrandBodySchema = registry.register(
    "UpdateProductBrandDto",
    z.object({
        name: z.string().min(1, "Brand name cannot be empty").optional().openapi({ example: "BrandY" }),
    })
);

export const updateProductBrandSchema = z.object({
    params: productBrandIdSchema.shape.params,
    body: UpdateProductBrandBodySchema,
});
export type UpdateProductBrandDTO = z.infer<typeof updateProductBrandSchema>["body"];

// ============ Response Schemas ============

const ProductBrandResponseSchema = registry.register(
    "ProductBrandResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "BrandX" }),
        isActive: z.boolean().optional().openapi({ example: true }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

// ============ Route Registrations ============

registry.registerPath({
    method: "post",
    path: "/api/product-brands",
    tags: ["Product Brands"],
    summary: "Create a new product brand",
    request: { body: { content: { "application/json": { schema: CreateProductBrandBodySchema } } } },
    responses: {
        201: { description: "The created product brand", content: { "application/json": { schema: ProductBrandResponseSchema } } }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/product-brands",
    tags: ["Product Brands"],
    summary: "Returns the list of all product brands",
    request: { query: z.object({ active: z.string().optional() }) },
    responses: {
        200: { description: "The list of product brands", content: { "application/json": { schema: z.array(ProductBrandResponseSchema) } } }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/product-brands/{id}",
    tags: ["Product Brands"],
    summary: "Get a product brand by id",
    request: { params: productBrandIdSchema.shape.params },
    responses: {
        200: { description: "The product brand", content: { "application/json": { schema: ProductBrandResponseSchema } } },
        404: { description: "Product brand not found" }
    }
});

registry.registerPath({
    method: "put",
    path: "/api/product-brands/{id}",
    tags: ["Product Brands"],
    summary: "Update a product brand",
    request: { params: productBrandIdSchema.shape.params, body: { content: { "application/json": { schema: UpdateProductBrandBodySchema } } } },
    responses: {
        200: { description: "The updated product brand", content: { "application/json": { schema: ProductBrandResponseSchema } } },
        404: { description: "Product brand not found" }
    }
});

registry.registerPath({
    method: "delete",
    path: "/api/product-brands/{id}",
    tags: ["Product Brands"],
    summary: "Soft delete a product brand",
    request: { params: productBrandIdSchema.shape.params },
    responses: { 200: { description: "Product brand deleted successfully" } }
});

registry.registerPath({
    method: "patch",
    path: "/api/product-brands/{id}/restore",
    tags: ["Product Brands"],
    summary: "Restore a soft-deleted product brand",
    request: { params: productBrandIdSchema.shape.params },
    responses: {
        200: { description: "The restored product brand", content: { "application/json": { schema: ProductBrandResponseSchema } } },
        404: { description: "Product brand not found" }
    }
});

// ============ Response DTOs for Runtime ============

export class ProductBrandResponseDTO {
    id: number;
    name: string;
    isActive?: boolean;
    deletedAt?: Date | null;
}

export const toProductBrandResponseDTO = (brand: any): ProductBrandResponseDTO => ({
    id: brand.id,
    name: brand.name,
    isActive: brand.is_active,
    deletedAt: brand.deleted_at,
});

export const toProductBrandResponseDTOList = (brands: any[]): ProductBrandResponseDTO[] =>
    brands.map(toProductBrandResponseDTO);