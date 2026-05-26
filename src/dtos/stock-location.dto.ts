import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";
import { StockLocation } from "../infra/entities/stock-location.entity";

export const stockLocationIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const stockLocationQuerySchema = z.object({
  query: z.object({
    ...paginationFields,
    activeOnly: z
      .enum(["true", "false", ""])
      .transform((v) => v === "true")
      .optional(),
  }),
});
export type StockLocationQueryDto = z.infer<
  typeof stockLocationQuerySchema
>["query"];

const AddressSchema = z.object({
  street: z
    .string()
    .min(1, "Street is required")
    .openapi({ example: "Main St" }),
  number: z.string().min(1, "Number is required").openapi({ example: "123" }),
  neighborhood: z
    .string()
    .min(1, "Neighborhood is required")
    .openapi({ example: "Downtown" }),
  city: z
    .string()
    .min(1, "City is required")
    .openapi({ example: "Metropolis" }),
  state: z.string().min(1, "State is required").openapi({ example: "NY" }),
  country: z.string().min(1, "Country is required").openapi({ example: "USA" }),
  complement: z.string().optional().openapi({ example: "Suite 100" }),
});

const PartialAddressSchema = z.object({
  street: z.string().min(1).optional().openapi({ example: "Main St" }),
  number: z.string().min(1).optional().openapi({ example: "123" }),
  neighborhood: z.string().min(1).optional().openapi({ example: "Downtown" }),
  city: z.string().min(1).optional().openapi({ example: "Metropolis" }),
  state: z.string().min(1).optional().openapi({ example: "NY" }),
  country: z.string().min(1).optional().openapi({ example: "USA" }),
  complement: z.string().optional().openapi({ example: "Suite 100" }),
});

export const CreateStockLocationBodySchema = registry.register(
  "CreateStockLocationDto",
  z.object({
    name: z
      .string()
      .min(1, "Stock location name is required")
      .openapi({ example: "Main Warehouse" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Central storage facility" }),
    address: AddressSchema.optional().openapi({
      example: {
        street: "Main St",
        number: "123",
        neighborhood: "Downtown",
        city: "Metropolis",
        state: "NY",
        country: "USA",
        complement: "Suite 100",
      },
    }),
  })
);

export const createStockLocationSchema = z.object({
  body: CreateStockLocationBodySchema,
});
export type CreateStockLocationDto = z.infer<
  typeof createStockLocationSchema
>["body"];

export const UpdateStockLocationBodySchema = registry.register(
  "UpdateStockLocationDto",
  z.object({
    name: z
      .string()
      .min(1, "Stock location name cannot be empty")
      .openapi({ example: "Main Warehouse" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Central storage facility" }),
    address: PartialAddressSchema.optional().openapi({
      example: {
        street: "Main St",
        number: "123",
        neighborhood: "Downtown",
        city: "Metropolis",
        state: "NY",
        country: "USA",
        complement: "Suite 100",
      },
    }),
  })
);

export const updateStockLocationSchema = z.object({
  params: stockLocationIdSchema.shape.params,
  body: UpdateStockLocationBodySchema,
});
export type UpdateStockLocationDto = z.infer<
  typeof updateStockLocationSchema
>["body"];

export const StockLocationResponseSchema = registry.register(
  "StockLocationResponseDto",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Main Warehouse" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Central storage facility" }),
    deletedAt: z
      .date()
      .nullable()
      .optional()
      .openapi({ type: "string", format: "date-time" }),
  })
);

export class StockLocationResponseDto {
  id: number;
  name: string;
  description?: string;
  deletedAt?: Date | null;
}

export const toStockLocationResponseDto = (
  entity: StockLocation
): StockLocationResponseDto => ({
  id: entity.id,
  name: entity.name,
  description: entity.description,
  deletedAt: entity.deleted_at,
});

export const toStockLocationResponseDtoList = (list: StockLocation[]) =>
  list.map(toStockLocationResponseDto);
