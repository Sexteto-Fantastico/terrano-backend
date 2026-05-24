import { z, registry } from "../infra/config/openapi";

export const productBrandIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const productBrandQuerySchema = z.object({
    query: z.object({
        active: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    })
});

export const CreateProductBrandBodySchema = registry.register(
    "CreateProductBrandDto",
    z.object({
        name: z.string().min(1, "Brand name is required").openapi({ example: "BrandX" }),
    })
);

export const createProductBrandSchema = z.object({ body: CreateProductBrandBodySchema });
export type CreateProductBrandDTO = z.infer<typeof createProductBrandSchema>["body"];

export const UpdateProductBrandBodySchema = registry.register(
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

export const ProductBrandResponseSchema = registry.register(
    "ProductBrandResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "BrandX" }),
        isActive: z.boolean().optional().openapi({ example: true }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

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

export class ProductBrandQueryDTO {
    name?: string;
    activeOnly?: boolean;
}