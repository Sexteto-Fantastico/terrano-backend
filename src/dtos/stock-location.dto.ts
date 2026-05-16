import { z, registry } from "../infra/config/openapi";
import { StockLocation } from "../infra/entities/stock-location.entity";

// ============ Schemas ============

export const stockLocationIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const stockLocationQuerySchema = z.object({
    query: z.object({
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional(),
    }).default({})
});

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

const CreateStockLocationBodySchema = registry.register(
    "CreateStockLocationDto",
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
export type CreateStockLocationDto = z.infer<typeof createStockLocationSchema>["body"];

const UpdateStockLocationBodySchema = registry.register(
    "UpdateStockLocationDto",
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
    params: stockLocationIdSchema.shape.params,
    body: UpdateStockLocationBodySchema,
});
export type UpdateStockLocationDto = z.infer<typeof updateStockLocationSchema>["body"];

// ============ Response Schemas ============

const StockLocationResponseSchema = registry.register(
    "StockLocationResponseDto",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Main Warehouse" }),
        description: z.string().optional().openapi({ example: "Central storage facility" }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

// ============ Route Registrations ============

registry.registerPath({
    method: "post",
    path: "/api/stock-locations",
    tags: ["Stock Locations"],
    summary: "Create a new stock location",
    request: { body: { content: { "application/json": { schema: CreateStockLocationBodySchema } } } },
    responses: {
        201: { description: "The created stock location", content: { "application/json": { schema: StockLocationResponseSchema } } }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/stock-locations",
    tags: ["Stock Locations"],
    summary: "Returns the list of all stock locations",
    request: { query: z.object({ activeOnly: z.string().optional() }) },
    responses: {
        200: { description: "The list of stock locations", content: { "application/json": { schema: z.array(StockLocationResponseSchema) } } }
    }
});

registry.registerPath({
    method: "get",
    path: "/api/stock-locations/{id}",
    tags: ["Stock Locations"],
    summary: "Get a stock location by id",
    request: { params: stockLocationIdSchema.shape.params },
    responses: {
        200: { description: "The stock location", content: { "application/json": { schema: StockLocationResponseSchema } } },
        404: { description: "Stock location not found" }
    }
});

registry.registerPath({
    method: "put",
    path: "/api/stock-locations/{id}",
    tags: ["Stock Locations"],
    summary: "Update a stock location",
    request: { params: stockLocationIdSchema.shape.params, body: { content: { "application/json": { schema: UpdateStockLocationBodySchema } } } },
    responses: {
        200: { description: "The updated stock location", content: { "application/json": { schema: StockLocationResponseSchema } } },
        404: { description: "Stock location not found" }
    }
});

registry.registerPath({
    method: "delete",
    path: "/api/stock-locations/{id}",
    tags: ["Stock Locations"],
    summary: "Soft delete a stock location",
    request: { params: stockLocationIdSchema.shape.params },
    responses: { 200: { description: "Stock location deleted successfully" } }
});

registry.registerPath({
    method: "patch",
    path: "/api/stock-locations/{id}/restore",
    tags: ["Stock Locations"],
    summary: "Restore a soft-deleted stock location",
    request: { params: stockLocationIdSchema.shape.params },
    responses: {
        200: { description: "The restored stock location", content: { "application/json": { schema: StockLocationResponseSchema } } },
        404: { description: "Stock location not found" }
    }
});

// ============ Runtime DTOs ============

export class StockLocationResponseDto {
    id: number;
    name: string;
    description?: string;
    deletedAt?: Date | null;
}

export const toStockLocationResponseDto = (entity: StockLocation): StockLocationResponseDto => ({
    id: entity.id,
    name: entity.name,
    description: entity.description,
    deletedAt: entity.deleted_at,
});

export const toStockLocationResponseDtoList = (list: StockLocation[]) =>
    list.map(toStockLocationResponseDto);