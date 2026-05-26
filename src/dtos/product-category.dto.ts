import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";
import { ProductCategory } from "../infra/entities/product-category.entity";

export const productCategoryIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const productCategoryQuerySchema = z.object({
  query: z.object({
    ...paginationFields,
    name: z.string().optional(),
    activeOnly: z
      .enum(["true", "false", ""])
      .transform((v) => v === "true")
      .optional(),
  }),
});

export type ProductCategoryQueryDTO = z.infer<
  typeof productCategoryQuerySchema
>["query"];

export const CreateProductCategoryBodySchema = registry.register(
  "CreateProductCategoryDto",
  z.object({
    name: z
      .string()
      .min(1, "Category name is required")
      .openapi({ example: "Electronics" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Electronic devices" }),
    parentId: z.number().int().positive().optional().openapi({ example: 1 }),
  })
);

export const createProductCategorySchema = z.object({
  body: CreateProductCategoryBodySchema,
});
export type CreateProductCategoryDTO = z.infer<
  typeof createProductCategorySchema
>["body"];

export const UpdateProductCategoryBodySchema = registry.register(
  "UpdateProductCategoryDto",
  z.object({
    name: z
      .string()
      .min(1, "Category name cannot be empty")
      .optional()
      .openapi({ example: "Electronics" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Electronic devices" }),
    parentId: z
      .number()
      .int()
      .positive()
      .nullable()
      .optional()
      .openapi({ example: 1 }),
  })
);

export const updateProductCategorySchema = z.object({
  params: productCategoryIdSchema.shape.params,
  body: UpdateProductCategoryBodySchema,
});
export type UpdateProductCategoryDTO = z.infer<
  typeof updateProductCategorySchema
>["body"];

export const ProductCategoryParentSchema = registry.register(
  "ProductCategoryParentDto",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Electronics" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Electronic devices" }),
    deletedAt: z
      .date()
      .nullable()
      .optional()
      .openapi({ type: "string", format: "date-time" }),
  })
);

export const ProductCategoryResponseSchema = registry.register(
  "ProductCategoryResponseDto",
  z.object({
    id: z.number().int().openapi({ example: 2 }),
    name: z.string().openapi({ example: "Computers" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "All kinds of computers" }),
    deletedAt: z
      .date()
      .nullable()
      .optional()
      .openapi({ type: "string", format: "date-time" }),
    parent: ProductCategoryParentSchema.nullable().optional(),
  })
);

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

export function toProductCategoryResponseDTO(
  entity: ProductCategory
): ProductCategoryResponseDTO {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    deletedAt: entity.deleted_at ?? null,
    parent: entity.parent
      ? {
          id: entity.parent.id,
          name: entity.parent.name,
          description: entity.parent.description,
          deletedAt: entity.parent.deleted_at ?? null,
        }
      : null,
  };
}

export function toProductCategoryResponseDTOList(
  entities: ProductCategory[]
): ProductCategoryResponseDTO[] {
  return entities.map(toProductCategoryResponseDTO);
}
