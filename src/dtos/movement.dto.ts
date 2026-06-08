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

export const CreateMovementEntryBodySchema = registry.register(
    "CreateMovementEntryBody",
    z.object({
        productId: z.number().int().positive("Product ID must be a positive integer"),
        stockLocationId: z.number().int().positive("Stock Location ID must be a positive integer"),
        quantity: z.number().int().positive("Quantity must be a positive integer"),
        category: z.enum(EntryMovementCategory),
        purchaseId: z.number().int().positive().nullable().optional(),
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
        purchase: z.any().nullable(),
    })
);

export type MovementEntryResponse = z.infer<typeof MovementEntryResponseSchema>;

export const toMovementEntryResponse = (entity: MovementEntry): MovementEntryResponse => ({
    id: entity.id as number,
    entryDate: entity.entryDate,
    entryMovementCategory: entity.entryMovementCategory,
    purchase: entity.purchase,
});

export const MovementEntryIdSchema = idParamSchema;
export const MovementExitIdSchema = idParamSchema;