import { z, registry } from "../infra/config/openapi";

export const HomeIndicatorSchema = z.object({
    total: z.number().openapi({ example: 12500.50 }),
    percentage: z.number().openapi({ example: 15.3 })
});

export const HomeIndicatorIntegerSchema = z.object({
    total: z.number().int().openapi({ example: 125 }),
    percentage: z.number().openapi({ example: 15.3 })
});

export const HomeAlertSchema = z.object({
    total: z.number().int().openapi({ example: 0 }),
    newCount: z.number().int().openapi({ example: 0 })
});

export const HomeResponseSchema = registry.register(
    "HomeResponse",
    z.object({
        purchases: HomeIndicatorSchema,
        entries: HomeIndicatorIntegerSchema,
        exits: HomeIndicatorIntegerSchema,
        alerts: HomeAlertSchema
    })
);

export type HomeResponse = z.infer<typeof HomeResponseSchema>;

export const toHomeResponse = (data: HomeResponse): HomeResponse => ({
    purchases: data.purchases,
    entries: data.entries,
    exits: data.exits,
    alerts: data.alerts,
});
