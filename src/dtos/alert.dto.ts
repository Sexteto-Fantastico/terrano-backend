import { z, registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";
import { Alert, AlertType } from "../infra/entities/alert.entity";
import { AlertUser } from "../infra/entities/alert-user.entity";
import { AlertProductThreshold } from "../infra/entities/alert-product-threshold.entity";

export const AlertIdSchema = idParamSchema;

export const AlertTypeSchema = z.enum([AlertType.PRODUCT_LOW_STOCK, AlertType.NEW_MATERIAL_REQUEST]);

export const AlertQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        name: z.string().optional(),
        type: AlertTypeSchema.optional(),
        activeOnly: activeOnlyField,
    })
});
export type AlertQuery = z.infer<typeof AlertQuerySchema>["query"];

export const AlertUserSchema = registry.register(
    "AlertUser",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        userId: z.number().int().openapi({ example: 2 }),
        name: z.string().optional().openapi({ example: "João" }),
        email: z.string().optional().openapi({ example: "joao@terrano.com" }),
    })
);

export const AlertProductThresholdSchema = registry.register(
    "AlertProductThreshold",
    z.object({
        id: z.number().int().optional().openapi({ example: 1 }),
        productId: z.number().int().openapi({ example: 10 }),
        productName: z.string().optional().openapi({ example: "Martelo" }),
        minQuantity: z.number().int().openapi({ example: 10 }),
    })
);

export const CreateAlertBodySchema = registry.register(
    "CreateAlertBody",
    z.object({
        name: z.string().min(1, "Alert name is required").openapi({ example: "Estoque mínimo" }),
        description: z.string().optional().openapi({ example: "Alerta quando o produto atingir o mínimo" }),
        type: AlertTypeSchema.openapi({ example: AlertType.PRODUCT_LOW_STOCK }),
        userIds: z.array(z.number().int().positive()).min(1, "At least one recipient is required").openapi({ example: [1, 2] }),
        productThresholds: z.array(z.object({
            productId: z.number().int().positive().openapi({ example: 5 }),
            minQuantity: z.number().int().min(0).openapi({ example: 10 }),
        })).optional().openapi({ example: [{ productId: 5, minQuantity: 10 }] }),
    })
);

export type CreateAlertBody = z.infer<typeof CreateAlertBodySchema>;

export const UpdateAlertBodySchema = registry.register(
    "UpdateAlertBody",
    z.object({
        name: z.string().min(1, "Alert name cannot be empty").optional().openapi({ example: "Estoque mínimo" }),
        description: z.string().optional().openapi({ example: "Atualização da descrição" }),
        type: AlertTypeSchema.optional().openapi({ example: AlertType.PRODUCT_LOW_STOCK }),
        userIds: z.array(z.number().int().positive()).optional().openapi({ example: [1, 2] }),
        productThresholds: z.array(z.object({
            productId: z.number().int().positive(),
            minQuantity: z.number().int().min(0),
        })).optional().openapi({ example: [{ productId: 5, minQuantity: 12 }] }),
    })
);

export type UpdateAlertBody = z.infer<typeof UpdateAlertBodySchema>;

export const AlertResponseSchema = registry.register(
    "AlertResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Estoque mínimo" }),
        description: z.string().nullable().optional().openapi({ example: "Alerta quando o produto atingir o mínimo" }),
        type: AlertTypeSchema.openapi({ example: AlertType.PRODUCT_LOW_STOCK }),
        users: z.array(AlertUserSchema).openapi({ example: [] }),
        productThresholds: z.array(AlertProductThresholdSchema).openapi({ example: [] }),
        isActive: z.boolean().openapi({ example: true }),
        createdAt: z.date().optional().openapi({ type: "string", format: "date-time" }),
        updatedAt: z.date().optional().openapi({ type: "string", format: "date-time" }),
        deletedAt: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
    })
);

export type AlertResponse = z.infer<typeof AlertResponseSchema>;

export const toAlertUserResponse = (alertUser: AlertUser): z.infer<typeof AlertUserSchema> => ({
    id: alertUser.id,
    userId: alertUser.user.id,
    name: alertUser.user.name,
    email: alertUser.user.email,
});

export const toAlertProductThresholdResponse = (threshold: AlertProductThreshold): z.infer<typeof AlertProductThresholdSchema> => ({
    id: threshold.id,
    productId: threshold.product.id,
    productName: threshold.product.name,
    minQuantity: threshold.min_quantity,
});

export const toAlertResponse = (alert: Alert): AlertResponse => ({
    id: alert.id,
    name: alert.name,
    description: alert.description ?? null,
    type: alert.type,
    users: alert.recipients ? alert.recipients.map(toAlertUserResponse) : [],
    productThresholds: alert.productThresholds ? alert.productThresholds.map(toAlertProductThresholdResponse) : [],
    isActive: !alert.deleted_at,
    createdAt: alert.created_at,
    updatedAt: alert.updated_at,
    deletedAt: alert.deleted_at ?? null,
});

export const toAlertResponseList = (list: Alert[]): AlertResponse[] => list.map(toAlertResponse);
