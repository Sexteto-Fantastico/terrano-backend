import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";

export const ProductBrandIdSchema = idParamSchema;

export const ProductBrandQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});
export type ProductBrandQuery = z.infer<typeof ProductBrandQuerySchema>["query"];
export const CreateProductBrandBodySchema = registry.register(
    "CreateProductBrand",
    z.object({
        name: z.string().min(1, "Brand name is required").openapi({ example: "BrandX" }),
    })
);

export const createProductBrandSchema = z.object({ body: CreateProductBrandBodySchema });
export type CreateProductBrand = z.infer<typeof createProductBrandSchema>["body"];

export const UpdateProductBrandBodySchema = registry.register(
    "UpdateProductBrand",
    z.object({
        name: z.string().min(1, "Brand name cannot be empty").optional().openapi({ example: "BrandY" }),
    })
);

export const updateProductBrandSchema = z.object({
    params: ProductBrandIdSchema.shape.params,
    body: UpdateProductBrandBodySchema,
});
export type UpdateProductBrand = z.infer<typeof updateProductBrandSchema>["body"];

export const ProductBrandResponseSchema = registry.register(
    "ProductBrandResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "BrandX" }),
        isActive: z.boolean().optional().openapi({ example: true })
    })
);

export type ProductBrandResponse = z.infer<typeof ProductBrandResponseSchema>;

export const toProductBrandResponse = (brand: any): ProductBrandResponse => ({
    id: brand.id,
    name: brand.name,
    isActive: !brand.deleted_at
});

export const toProductBrandResponseList = (brands: any[]): ProductBrandResponse[] =>
    brands.map(toProductBrandResponse);
