import { z, registry } from "../infra/config/openapi";
import { ExitMovementCategory, MovementExit } from "../infra/entities/movement-exit.entity";
import { EntryMovementCategory, MovementEntry } from "../infra/entities/movement-entry.entity";
import { idParamSchema } from "./common/pagination.dto";

export const CreateMovementExitBodySchema = registry.register(
    "CreateMovementExitBody",
    z.object({
        productId: z.number().int().positive("Product ID must be a positive integer"),
        stockLocationId: z.number().int().positive("Stock Location ID must be a positive integer"),
        quantity: z.number().int().positive("Quantity must be a positive integer"),
        category: z.enum(ExitMovementCategory),
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
        purchase: z.any().nullable(),
        stockRequisition: z.any().nullable(),
    })
);

export type MovementExitResponse = z.infer<typeof MovementExitResponseSchema>;

export const toMovementExitResponse = (entity: MovementExit): MovementExitResponse => ({
    id: entity.id,
    exitDate: entity.exitDate,
    exitMovementCategory: entity.exitMovementCategory,
    purchase: entity.purchase,
    stockRequisition: entity.stockRequisition,
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