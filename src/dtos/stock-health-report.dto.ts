import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";
import { StockLocationProduct } from "../infra/entities/stock-location-product.entity";

export enum StockHealthStatus {
    ESGOTADO = "ESGOTADO",
    BAIXO = "BAIXO",
}

export const StockHealthStatusSchema = z.enum(StockHealthStatus).openapi({ example: StockHealthStatus.BAIXO });

export const StockHealthReportQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        search: z.string().optional().openapi({ example: "Cimento" }),
        stockLocationId: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
        status: StockHealthStatusSchema.optional(),
    })
});

export type StockHealthReportQuery = z.infer<typeof StockHealthReportQuerySchema>["query"];

export const StockHealthSummaryQuerySchema = z.object({
    query: z.object({
        stockLocationId: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
    })
});

export type StockHealthSummaryQuery = z.infer<typeof StockHealthSummaryQuerySchema>["query"];

export const StockHealthReportItemSchema = registry.register(
    "StockHealthReportItem",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        productId: z.number().int().openapi({ example: 5 }),
        code: z.string().openapi({ example: "PROD-001" }),
        name: z.string().openapi({ example: "Cimento CP-II 50kg" }),
        category: z.string().nullable().openapi({ example: "Materiais de construção" }),
        brand: z.string().nullable().openapi({ example: "Votoran" }),
        measurementUnit: z.string().openapi({ example: "sc" }),
        stockLocationId: z.number().int().openapi({ example: 1 }),
        stockLocationName: z.string().openapi({ example: "Almoxarifado Central" }),
        quantity: z.number().int().openapi({ example: 0 }),
        minStock: z.number().int().nullable().openapi({ example: 20 }),
        shortage: z.number().int().nullable().openapi({ example: 20 }),
        status: StockHealthStatusSchema,
        updatedAt: z.date().openapi({ type: "string", format: "date-time" }),
    })
);

export type StockHealthReportItem = z.infer<typeof StockHealthReportItemSchema>;

export const StockHealthSummaryResponseSchema = registry.register(
    "StockHealthSummaryResponse",
    z.object({
        totalTracked: z.number().int().openapi({ example: 240 }),
        outOfStock: z.number().int().openapi({ example: 6 }),
        lowStock: z.number().int().openapi({ example: 14 }),
        totalCritical: z.number().int().openapi({ example: 20 }),
        criticalPercentage: z.number().openapi({ example: 8.33 }),
    })
);

export type StockHealthSummaryResponse = z.infer<typeof StockHealthSummaryResponseSchema>;

export function toStockHealthStatus(quantity: number, minStock?: number | null): StockHealthStatus | null {
    if (quantity <= 0) return StockHealthStatus.ESGOTADO;
    if (minStock != null && quantity < minStock) return StockHealthStatus.BAIXO;
    return null;
}

export function toStockHealthReportItem(entity: StockLocationProduct): StockHealthReportItem {
    const minStock = entity.product.min_stock ?? null;
    const status = toStockHealthStatus(entity.quantity, minStock) ?? StockHealthStatus.BAIXO;

    return {
        id: entity.id,
        productId: entity.product.id,
        code: entity.product.code,
        name: entity.product.name,
        category: entity.product.category?.name ?? null,
        brand: entity.product.brand?.name ?? null,
        measurementUnit: entity.product.measurement_unit?.symbol ?? entity.product.measurement_unit?.name ?? "-",
        stockLocationId: entity.location.id,
        stockLocationName: entity.location.name,
        quantity: entity.quantity,
        minStock,
        shortage: minStock != null ? Math.max(minStock - entity.quantity, 0) : null,
        status,
        updatedAt: entity.updated_at,
    };
}

export function toStockHealthReportItemList(list: StockLocationProduct[]): StockHealthReportItem[] {
    return list.map(toStockHealthReportItem);
}
