import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";
import { ProductResponseSchema, toProductResponse } from "./product.dto";
import { StockLocationProduct } from "../infra/entities/stock-location-product.entity";

export enum StockPositioningStatus {
    ESGOTADO = "ESGOTADO",
    BAIXO = "BAIXO",
    ADEQUADO = "ADEQUADO",
    EXCESSO = "EXCESSO",
}

export const StockPositioningStatusSchema = z.enum(StockPositioningStatus).openapi({ example: StockPositioningStatus.ADEQUADO });

export const StockPositioningQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        search: z.string().optional().openapi({ example: "Steel" }),
        stockLocationId: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
        status: z.nativeEnum(StockPositioningStatus).optional().openapi({ example: StockPositioningStatus.BAIXO }),
    })
});

export type StockPositioningQuery = z.infer<typeof StockPositioningQuerySchema>["query"];

export const StockPositioningResponseSchema = registry.register(
    "StockPositioningResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        productId: z.number().int().openapi({ example: 1 }),
        product: ProductResponseSchema,
        quantity: z.number().int().openapi({ example: 50 }),
        stockLocationId: z.number().int().openapi({ example: 1 }),
        status: StockPositioningStatusSchema,
        updatedAt: z.date().openapi({ type: "string", format: "date-time" }),
    })
);

export type StockPositioningResponse = z.infer<typeof StockPositioningResponseSchema>;

export const StockPositioningMetricsResponseSchema = registry.register(
    "StockPositioningMetricsResponse",
    z.object({
        totalItems: z.number().int().openapi({ example: 120 }),
        lowStock: z.number().int().openapi({ example: 15 }),
        excessStock: z.number().int().openapi({ example: 5 }),
        outOfStock: z.number().int().openapi({ example: 2 }),
    })
);

export type StockPositioningMetricsResponse = z.infer<typeof StockPositioningMetricsResponseSchema>;

export const ExportStockReportBodySchema = registry.register(
    "ExportStockReportBody",
    z.object({
        stockLocationId: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
    })
);

export const exportStockReportSchema = z.object({
    body: ExportStockReportBodySchema,
});

export type ExportStockReportBody = z.infer<typeof exportStockReportSchema>["body"];

export function toStockPositioningStatus(quantity: number, minStock?: number | null, maxStock?: number | null): StockPositioningStatus {
    if (quantity <= 0) return StockPositioningStatus.ESGOTADO;
    if (minStock != null && quantity < minStock) return StockPositioningStatus.BAIXO;
    if (maxStock != null && quantity > maxStock) return StockPositioningStatus.EXCESSO;
    return StockPositioningStatus.ADEQUADO;
}

export function toStockPositioningResponse(entity: StockLocationProduct): StockPositioningResponse {
    return {
        id: entity.id,
        productId: entity.product.id,
        product: toProductResponse(entity.product),
        quantity: entity.quantity,
        stockLocationId: entity.location.id,
        status: toStockPositioningStatus(entity.quantity, entity.product.min_stock, entity.product.max_stock),
        updatedAt: entity.updated_at,
    };
}
