import { z, registry } from "../infra/config/openapi";
import { ExitMovementCategory, MovementExit } from "../infra/entities/movement-exit.entity";

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
