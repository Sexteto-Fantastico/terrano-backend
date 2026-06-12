import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";
import { StockLocation } from "../infra/entities/stock-location.entity";

export const StockLocationIdSchema = idParamSchema;

export const StockLocationQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});
export type StockLocationQuery = z.infer<typeof StockLocationQuerySchema>["query"];

const AddressSchema = z.object({
    street: z.string().min(1, "Street is required").openapi({ example: "Main St" }),
    number: z.string().min(1, "Number is required").openapi({ example: "123" }),
    neighborhood: z.string().min(1, "Neighborhood is required").openapi({ example: "Downtown" }),
    city: z.string().min(1, "City is required").openapi({ example: "Metropolis" }),
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

export const AddressResponseSchema = registry.register(
    "StockLocationAddressResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        street: z.string().openapi({ example: "Main St" }),
        number: z.string().openapi({ example: "123" }),
        neighborhood: z.string().openapi({ example: "Downtown" }),
        city: z.string().openapi({ example: "Metropolis" }),
        state: z.string().openapi({ example: "NY" }),
        country: z.string().openapi({ example: "USA" }),
        complement: z.string().nullable().optional().openapi({ example: "Suite 100" }),
    })
);

export const CreateStockLocationBodySchema = registry.register(
    "CreateStockLocation",
    z.object({
        name: z.string().min(1, "Stock location name is required").openapi({ example: "Main Warehouse" }),
        description: z.string().optional().openapi({ example: "Central storage facility" }),
        address: AddressSchema.optional().openapi({
            example: {
                street: "Main St",
                number: "123",
                neighborhood: "Downtown",
                city: "Metropolis",
                state: "NY",
                country: "USA",
                complement: "Suite 100",
            }
        }),
    })
);

export const createStockLocationSchema = z.object({ body: CreateStockLocationBodySchema });
export type CreateStockLocation = z.infer<typeof createStockLocationSchema>["body"];

export const UpdateStockLocationBodySchema = registry.register(
    "UpdateStockLocation",
    z.object({
        name: z.string().min(1, "Stock location name cannot be empty").openapi({ example: "Main Warehouse" }),
        description: z.string().optional().openapi({ example: "Central storage facility" }),
        address: PartialAddressSchema.optional().openapi({
            example: {
                street: "Main St",
                number: "123",
                neighborhood: "Downtown",
                city: "Metropolis",
                state: "NY",
                country: "USA",
                complement: "Suite 100",
            }
        }),
    })
);

export const updateStockLocationSchema = z.object({
    params: StockLocationIdSchema.shape.params,
    body: UpdateStockLocationBodySchema,
});
export type UpdateStockLocation = z.infer<typeof updateStockLocationSchema>["body"];

export const StockLocationResponseSchema = registry.register(
    "StockLocationResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Main Warehouse" }),
        description: z.string().optional().openapi({ example: "Central storage facility" }),
        isActive: z.boolean().openapi({ example: true }),
        address: AddressResponseSchema.nullable().optional(),
    })
);

export const StockLocationDetailResponseSchema = registry.register(
    "StockLocationDetailResponse",
    StockLocationResponseSchema
);

export type StockLocationResponse = z.infer<typeof StockLocationResponseSchema>;
export type StockLocationDetailResponse = z.infer<typeof StockLocationDetailResponseSchema>;

export const toStockLocationResponse = (entity: StockLocation): StockLocationResponse => ({
    id: entity.id,
    name: entity.name,
    description: entity.description,
    isActive: !entity.deleted_at,
    address: entity.address ? {
        id: entity.address.id,
        street: entity.address.street,
        number: entity.address.number,
        neighborhood: entity.address.neighborhood,
        city: entity.address.city,
        state: entity.address.state,
        country: entity.address.country,
        complement: entity.address.complement,
    } : null,
});

export const toStockLocationResponseList = (list: StockLocation[]) =>
    list.map(toStockLocationResponse);