import { Purchase } from "../infra/entities/purchase.entity";
import { z, registry } from "../infra/config/openapi";
import { paginationFields } from "./common/pagination.dto";

export const purchaseIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const purchaseQuerySchema = z.object({
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
export type PurchaseQueryDto = z.infer<typeof purchaseQuerySchema>["query"];

export const CreatePurchaseBodySchema = registry.register(
    "CreatePurchaseDto",
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

export const createpurchaseSchema = CreatePurchaseBodySchema;
export type CreatePurchaseDto = z.infer<typeof createpurchaseSchema>;

export const UpdatePurchaseBodySchema = registry.register(
    "UpdatePurchaseDto",
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
export const updatepurchaseSchema = UpdatePurchaseBodySchema;
export type UpdatePurchaseDto = z.infer<typeof updatepurchaseSchema>;

export class PurchaseResponseDto {
    id: number;
    total: number;
    estimatedDeliveryDate?: Date;
    purchaseDate: Date;
    supplier?: {
        id: number;
        name: string;
    };
    nfNumber: string;
    nfSerie: string;
    usedNfXmlDocument: boolean;
    internalNotes?: string;
    payments?: {
        id?: number;
        total: number;
        paymentMethod: string;
    }[];
    products?: {
        id?: number;
        productId: number;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
}

export const toPurchaseResponseDto = (entity: Purchase): PurchaseResponseDto => ({
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
});

export const toPurchaseResponseDtoList = (list: Purchase[]) =>
    list.map(toPurchaseResponseDto);