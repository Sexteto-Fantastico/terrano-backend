import { Purchase } from "../infra/entities/purchase.entity";
import { z, registry } from "../infra/config/openapi";
import { idParamSchema, paginationFields } from "./common/pagination.dto";

export const PurchaseIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const PurchaseQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        activeOnly: z.enum(["true", "false", ""]).transform(v => v === "true").optional().openapi({ example: "true" }),
        supplierId: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
        purchaseDate: z.string().optional().openapi({ example: "2024-11-01" }),
        estimatedDeliveryDate: z.string().optional().openapi({ example: "2024-12-31" }),
        nfNumber: z.string().optional().openapi({ example: "12345" }),
        nfSerie: z.string().optional().openapi({ example: "1" }),
    }).openapi({
        example: {
            pageIndex: 1,
            pageSize: 10,
            activeOnly: "true",
            supplierId: 1,
            purchaseDate: "2024-11-01",
            estimatedDeliveryDate: "2024-12-31",
            nfNumber: "12345",
            nfSerie: "1",
        }
    })
});
export type PurchaseQuery = z.infer<typeof PurchaseQuerySchema>["query"];

export const CreatePurchaseBodySchema = registry.register(
    "CreatePurchaseBody",
    z.object({
        total: z.number().positive().openapi({ example: 150.75 }),
        estimatedDeliveryDate: z.string().optional().openapi({ example: "2024-12-31" }),
        purchaseDate: z.string().openapi({ example: "2024-11-01" }),
        supplierId: z.number().int().positive().optional().openapi({ example: 1 }),
        nfNumber: z.string().optional().openapi({ example: "12345" }),
        nfSerie: z.string().optional().openapi({ example: "1" }),
        usedNfXmlDocument: z.boolean().openapi({ example: false }),
        internalNotes: z.string().optional().openapi({ example: "Urgent delivery" }),
        payments: z.array(z.object({
            total: z.number().positive().openapi({ example: 150.75 }),
            paymentMethod: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "PIX"]).openapi({ example: "CASH" }),
        })).min(1).openapi({ example: [{ total: 150.75, paymentMethod: "CASH" }] }),
        products: z.array(z.object({
            productId: z.number().int().positive().openapi({ example: 1 }),
            quantity: z.number().positive().openapi({ example: 10 }),
            unitPrice: z.number().positive().openapi({ example: 15.075 }),
            total: z.number().positive().openapi({ example: 150.75 }),
        })).min(1).openapi({ example: [{ productId: 1, quantity: 10, unitPrice: 15.075, total: 150.75 }] }),
    })
);

export const createPurchaseSchema = CreatePurchaseBodySchema;
export type CreatePurchaseBody = z.infer<typeof createPurchaseSchema>;

export const UpdatePurchaseBodySchema = registry.register(
    "UpdatePurchaseBody",
    z.object({
        total: z.number().positive().optional().openapi({ example: 150.75 }),
        estimatedDeliveryDate: z.string().optional().openapi({ example: "2024-12-31" }),
        purchaseDate: z.string().optional().openapi({ example: "2024-11-01" }),
        supplierId: z.number().int().positive().optional().openapi({ example: 1 }),
        nfNumber: z.string().optional().openapi({ example: "12345" }),
        nfSerie: z.string().optional().openapi({ example: "1" }),
        usedNfXmlDocument: z.boolean().optional().openapi({ example: false }),
        internalNotes: z.string().optional().openapi({ example: "Urgent delivery" }),
        payments: z.array(z.object({
            id: z.number().int().positive().optional().openapi({ example: 1 }),
            total: z.number().positive().openapi({ example: 150.75 }),
            paymentMethod: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "PIX"]).openapi({ example: "CASH" }),
        })).optional(),
        products: z.array(z.object({
            id: z.number().int().positive().optional().openapi({ example: 1 }),
            productId: z.number().int().positive().openapi({ example: 1 }),
            quantity: z.number().positive().openapi({ example: 10 }),
            unitPrice: z.number().positive().openapi({ example: 15.075 }),
            total: z.number().positive().openapi({ example: 150.75 }),
        })).optional(),
    })
);
export const updatePurchaseSchema = UpdatePurchaseBodySchema;
export type UpdatePurchaseBody = z.infer<typeof updatePurchaseSchema>;

export const PurchaseResponseSchema = registry.register(
    "PurchaseResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        total: z.number().openapi({ example: 150.75 }),
        estimatedDeliveryDate: z.date().nullable().optional().openapi({ type: "string", format: "date-time" }),
        purchaseDate: z.date().openapi({ type: "string", format: "date-time" }),
        supplier: z.object({
            id: z.number().int().openapi({ example: 1 }),
            name: z.string().openapi({ example: "Supplier Name" }),
        }).optional(),
        nfNumber: z.string().openapi({ example: "12345" }),
        nfSerie: z.string().openapi({ example: "1" }),
        usedNfXmlDocument: z.boolean().openapi({ example: false }),
        internalNotes: z.string().optional().openapi({ example: "Urgent delivery" }),
        payments: z.array(z.object({
            id: z.number().int().optional().openapi({ example: 1 }),
            total: z.number().openapi({ example: 150.75 }),
            paymentMethod: z.string().openapi({ example: "CASH" }),
        })).optional(),
        products: z.array(z.object({
            id: z.number().int().optional().openapi({ example: 1 }),
            productId: z.number().int().openapi({ example: 1 }),
            quantity: z.number().openapi({ example: 10 }),
            unitPrice: z.number().openapi({ example: 15.075 }),
            total: z.number().openapi({ example: 150.75 }),
        })).optional(),
        isActive: z.boolean().openapi({ example: true }),
    })
);

export type PurchaseResponse = z.infer<typeof PurchaseResponseSchema>;

export const toPurchaseResponse = (entity: Purchase): PurchaseResponse => ({
    id: entity.id,
    total: entity.total,
    estimatedDeliveryDate: entity.estimated_delivery_date,
    purchaseDate: entity.purchase_date,
    supplier: entity.supplier ? {
        id: entity.supplier.id,
        name: entity.supplier.trade_name,
    } : undefined,
    nfNumber: entity.nf_number,
    nfSerie: entity.nf_serie,
    usedNfXmlDocument: entity.used_nf_xml_document,
    internalNotes: entity.internal_notes,
    payments: (entity as any).payments ? (entity as any).payments.map((p: any) => ({ id: p.id, total: p.total, paymentMethod: p.payment_method })) : undefined,
    products: (entity as any).items ? (entity as any).items.map((it: any) => ({ id: it.id, productId: it.product?.id ?? it.product_id, quantity: it.quantity, unitPrice: it.unit_price, total: it.total })) : undefined,
    isActive: entity.deleted_at ? false : true,
});

export const toPurchaseResponseList = (list: Purchase[]) =>
    list.map(toPurchaseResponse);

export const ReceivePurchaseBodySchema = registry.register(
    "ReceivePurchaseBody",
    z.object({
        items: z.array(
            z.object({
                purchaseItemId: z.number().int().positive("Purchase Item ID is required"),
                stockLocationId: z.number().int().positive("Stock Location ID is required")
            })
        ).min(1, "You must provide at least one item to receive")
    })
);

export const receivePurchaseSchema = z.object({
    params: idParamSchema.shape.params,
    body: ReceivePurchaseBodySchema
});

export type ReceivePurchaseBody = z.infer<typeof receivePurchaseSchema>["body"];