import { z, registry } from "../infra/config/openapi";
import { ExitMovementCategory, MovementExit } from "../infra/entities/movement-exit.entity";
import { EntryMovementCategory, MovementEntry } from "../infra/entities/movement-entry.entity";
import { idParamSchema, paginationFields, activeOnlyField } from "./common/pagination.dto";

export const MovementExitQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        exitMovementCategory: z.enum(ExitMovementCategory).optional().or(z.string().optional()),
        stockLocationId: z.coerce.number().int().positive().optional(),
        activeOnly: activeOnlyField,
    })
});

export type MovementExitQuery = z.infer<typeof MovementExitQuerySchema>["query"];

export const CreateMovementExitBodySchema = registry.register(
    "CreateMovementExitBody",
    z.object({
        stockLocationId: z.number().int().positive("Stock Location ID must be a positive integer"),
        category: z.enum(ExitMovementCategory),
        internalNotes: z.string().nullable().optional(),
        stockRequisitionId: z.number().int().positive().optional(),
        movementEntryId: z.number().int().positive().nullable().optional(),
        nfNumber: z.string().nullable().optional(),
        nfSerie: z.string().nullable().optional(),
        items: z.array(z.object({
            productId: z.number().int().positive("Product ID must be a positive integer"),
            quantity: z.number().int().positive("Quantity must be a positive integer"),
            unitCost: z.number().positive("Unit cost must be a positive number"),
        })).min(1, "At least one item is required"),
    })
);

export const createMovementExitSchema = z.object({ body: CreateMovementExitBodySchema });
export type CreateMovementExitBody = z.infer<typeof createMovementExitSchema>["body"];

export const MovementExitResponseSchema = registry.register(
    "MovementExitResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        exitDate: z.date().openapi({ type: "string", format: "date-time" }),
        exitMovementCategory: z.enum(ExitMovementCategory),
        internalNotes: z.string().nullable().optional(),
        nfNumber: z.string().nullable().optional(),
        nfSerie: z.string().nullable().optional(),
        movementEntryId: z.number().nullable().optional(),
        purchase: z.any().nullable(),
        stockRequisition: z.any().nullable(),
        isActive: z.boolean().optional(),
        items: z.array(z.any()).optional(),
    })
);

export type MovementExitResponse = z.infer<typeof MovementExitResponseSchema>;

export const toMovementExitResponse = (entity: MovementExit): MovementExitResponse => ({
    id: entity.id,
    exitDate: entity.exitDate,
    exitMovementCategory: entity.exitMovementCategory,
    internalNotes: entity.internalNotes,
    nfNumber: entity.nfNumber,
    nfSerie: entity.nfSerie,
    movementEntryId: entity.movementEntry?.id ?? null,
    purchase: entity.purchase,
    stockRequisition: entity.stockRequisition,
    isActive: entity.deleted_at === null || entity.deleted_at === undefined,
    items: entity.movements?.map(m => ({
        id: m.id,
        product: m.product,
        quantity: Math.abs(m.quantity),
        unitCost: m.unit_cost
    })),
});

export const MovementEntryQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        stockLocationId: z.coerce.number().int().positive().optional(),
        supplierId: z.coerce.number().int().positive().optional(),
        nfNumber: z.string().optional(),
        nfSerie: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});

export type MovementEntryQuery = z.infer<typeof MovementEntryQuerySchema>["query"];

export const CreateMovementEntryBodySchema = registry.register(
    "CreateMovementEntryBody",
    z.object({
        stockLocationId: z.number().int().positive("Stock Location ID must be a positive integer"),
        category: z.enum(EntryMovementCategory),
        entryDate: z.string().optional(),
        purchaseId: z.number().int().positive().nullable().optional(),
        internalNotes: z.string().nullable().optional(),
        items: z.array(z.object({
            productId: z.number().int().positive("Product ID must be a positive integer"),
            quantity: z.number().int().positive("Quantity must be a positive integer"),
            unitCost: z.number().min(0, "Unit cost must be a non-negative number"),
        })).min(1, "At least one item is required"),
    })
);

export const createMovementEntrySchema = z.object({ body: CreateMovementEntryBodySchema });
export type CreateMovementEntryBody = z.infer<typeof createMovementEntrySchema>["body"];

export const MovementEntryResponseSchema = registry.register(
    "MovementEntryResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        entryDate: z.date().openapi({ type: "string", format: "date-time" }),
        entryMovementCategory: z.enum(EntryMovementCategory),
        internalNotes: z.string().nullable().optional(),
        purchase: z.any().nullable(),
        stockLocation: z.any().nullable(),
        isActive: z.boolean().optional(),
        items: z.array(z.any()).optional(),
    })
);

export type MovementEntryResponse = z.infer<typeof MovementEntryResponseSchema>;

export const toMovementEntryResponse = (entity: MovementEntry): MovementEntryResponse => ({
    id: entity.id as number,
    entryDate: entity.entryDate,
    entryMovementCategory: entity.entryMovementCategory,
    internalNotes: entity.internalNotes,
    purchase: entity.purchase ? {
        id: entity.purchase.id,
        nfNumber: entity.purchase.nf_number,
        nfSerie: entity.purchase.nf_serie,
        supplier: entity.purchase.supplier ? {
            id: entity.purchase.supplier.id,
            tradeName: entity.purchase.supplier.trade_name,
        } : null,
        products: (entity.purchase as any).items?.map((it: any) => ({
            id: it.id,
            productId: it.product?.id ?? it.product_id,
            productName: it.product?.name,
            quantity: it.quantity,
            unitPrice: it.unit_price,
        })) ?? [],
    } : null,
    stockLocation: entity.movements?.[0]?.stock_location ? {
        id: entity.movements[0].stock_location.id,
        name: entity.movements[0].stock_location.name,
    } : null,
    isActive: entity.deleted_at === null || entity.deleted_at === undefined,
    items: entity.movements?.map(m => ({
        id: m.id,
        product: m.product,
        quantity: Math.abs(m.quantity),
        unitCost: m.unit_cost,
    })),
});

export const MovementEntryIdSchema = idParamSchema;
export const MovementExitIdSchema = idParamSchema;
