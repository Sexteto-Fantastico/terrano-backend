import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";
import {
  ProductCategoryResponseDTO,
  toProductCategoryResponseDTO,
} from "./product-category.dto";
import { Product } from "../infra/entities/product.entity";
import {
  MeasurementUnitResponseDto,
  toMeasurementUnitResponseDto,
} from "./measurement-unit.dto";
import {
  ProductBrandResponseDTO,
  toProductBrandResponseDTO,
} from "./product-brand.dto";

export const ProductResponseSchema = registry.register(
  "ProductResponseDTO",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Steel Rod 12mm" }),
    code: z.string().openapi({ example: "PROD-001" }),
    description: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "High quality steel rod" }),
    category: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Category" }),
        description: z
          .string()
          .nullable()
          .optional()
          .openapi({ example: "Description" }),
        deletedAt: z.string().nullable().optional().openapi({ example: null }),
        parent: z
          .object({
            id: z.number().int().openapi({ example: 1 }),
            name: z.string(),
            description: z.string().nullable().optional(),
            deletedAt: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
      })
      .openapi({ description: "Product category" }),
    measurementUnit: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Kilogram" }),
        symbol: z.string().openapi({ example: "kg" }),
        type: z.string().openapi({ example: "Weight" }),
        deletedAt: z.string().nullable().optional().openapi({ example: null }),
      })
      .openapi({ description: "Measurement unit" }),
    brand: z
      .object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Brand" }),
        isActive: z.boolean().optional().openapi({ example: true }),
        deletedAt: z.string().nullable().optional().openapi({ example: null }),
      })
      .openapi({ description: "Product brand" }),
    minStock: z.number().int().nullable().optional().openapi({ example: 10 }),
    maxStock: z.number().int().nullable().optional().openapi({ example: 100 }),
    deletedAt: z.string().nullable().openapi({ example: null }),
  })
);

export const productQuerySchema = z.object({
  query: z.object({
    ...paginationFields,
    name: z.string().optional(),
    activeOnly: z
      .enum(["true", "false", ""])
      .transform((v) => v === "true")
      .optional(),
    brandId: z.coerce.number().int().positive().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    code: z.string().optional(),
  }),
});

export type ProductQueryDTO = z.infer<typeof productQuerySchema>["query"];

export const CreateProductBodySchema = registry.register(
  "CreateProductRequestDTO",
  z.object({
    name: z
      .string()
      .min(1, "Product name is required")
      .openapi({ example: "Steel Rod 12mm" }),
    code: z
      .string()
      .min(1, "Product code is required")
      .openapi({ example: "PROD-001" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "High quality steel rod" }),
    categoryId: z
      .number()
      .int()
      .positive("Category ID is required")
      .openapi({ example: 1 }),
    measurementUnitId: z
      .number()
      .int()
      .positive("Measurement Unit ID is required")
      .openapi({ example: 1 }),
    brandId: z
      .number()
      .int()
      .positive("Brand ID is required")
      .openapi({ example: 1 }),
    minStock: z
      .number()
      .int()
      .nonnegative("Minimum stock cannot be negative")
      .optional()
      .openapi({ example: 10 }),
    maxStock: z
      .number()
      .int()
      .nonnegative("Maximum stock cannot be negative")
      .optional()
      .openapi({ example: 100 }),
  })
);

export const createProductSchema = z.object({
  body: CreateProductBodySchema,
});

export type CreateProductRequestDTO = z.infer<
  typeof createProductSchema
>["body"];

export const UpdateProductBodySchema = registry.register(
  "ProductUpdateRequestDTO",
  z.object({
    name: z
      .string()
      .min(1, "Product name cannot be empty")
      .optional()
      .openapi({ example: "Updated Steel Rod" }),
    code: z
      .string()
      .min(1, "Product code cannot be empty")
      .optional()
      .openapi({ example: "PROD-002" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Updated description" }),
    categoryId: z.number().int().positive().optional().openapi({ example: 2 }),
    measurementUnitId: z
      .number()
      .int()
      .positive()
      .optional()
      .openapi({ example: 2 }),
    brandId: z.number().int().positive().optional().openapi({ example: 2 }),
    minStock: z
      .number()
      .int()
      .nonnegative("Minimum stock cannot be negative")
      .optional()
      .openapi({ example: 5 }),
    maxStock: z
      .number()
      .int()
      .nonnegative("Maximum stock cannot be negative")
      .optional()
      .openapi({ example: 50 }),
  })
);

export const updateProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: UpdateProductBodySchema,
});

export type ProductUpdateRequestDTO = z.infer<
  typeof updateProductSchema
>["body"] &
  z.infer<typeof updateProductSchema>["params"];

export const productIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

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
