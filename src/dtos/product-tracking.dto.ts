import { z, registry } from "../infra/config/openapi";

export const ProductTrackingQuerySchema = z.object({
    query: z.object({
        productId: z.coerce.number().int().positive(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
});

export type ProductTrackingQuery =
    z.infer<typeof ProductTrackingQuerySchema>["query"];

export const ProductTrackingResponseSchema =
    registry.register(
        "ProductTrackingResponse",
        z.object({
            productId: z.number(),

            averageCost: z.number(),

            periodAverageCost: z.number(),

            movements: z.array(
                z.object({
                    id: z.number(),

                    date: z.date(),

                    type: z.enum([
                        "IN",
                        "OUT",
                    ]),

                    quantity: z.number(),

                    unitCost:
                        z.number()
                            .nullable(),

                    total: z.number(),

                    purpose:
                        z.string()
                            .nullable(),
                })
            ),
        })
    );