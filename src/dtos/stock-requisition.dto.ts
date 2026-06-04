import { z, registry } from "../infra/config/openapi";
import { RequisitionStatus } from "../infra/entities/stock-requisition.entity";

export const stockRequisitionIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const CreateStockRequisitionBodySchema = registry.register(
    "CreateStockRequisitionDto",
    z.object({
        requesterJustification: z.string().min(1),

        items: z.array(
            z.object({
                productId: z.number().int().positive(),
                quantity: z.number().int().positive()
            })
        ).min(1)
    })
);

export const createStockRequisitionSchema = z.object({
    body: CreateStockRequisitionBodySchema
});

export type CreateStockRequisitionDto =
    z.infer<typeof createStockRequisitionSchema>["body"];

export const UpdateStockRequisitionBodySchema = registry.register(
    "UpdateStockRequisitionDto",
    z.object({
        requesterJustification: z.string().optional(),

        items: z.array(
            z.object({
                productId: z.number().int().positive(),
                quantity: z.number().int().positive()
            })
        ).optional()
    })
);

export const updateStockRequisitionSchema = z.object({
    params: stockRequisitionIdSchema.shape.params,
    body: UpdateStockRequisitionBodySchema
});

export type UpdateStockRequisitionDto =
    z.infer<typeof updateStockRequisitionSchema>["body"];

export const stockRequisitionQuerySchema = z.object({
    query: z.object({
        status: z.nativeEnum(RequisitionStatus).optional(),
        openOnly: z.coerce.boolean().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    })
});

export const StockRequisitionResponseSchema = registry.register(
    "StockRequisitionResponseDto",
    z.object({
        id: z.number().int(),
        requesterJustification: z.string(),
        status: z.nativeEnum(RequisitionStatus),
        createdAt: z.date(),

        items: z.array(
            z.object({
                productId: z.number().int(),
                quantity: z.number().int(),
                delivered: z.boolean(),
            })
        )
    })
);

export class StockRequisitionResponseDto {
    id!: number;
    requesterJustification!: string;
    status!: RequisitionStatus;
    createdAt!: Date;

    items!: {
        productId: number;
        quantity: number;
        delivered: boolean;
    }[];
}

export const toStockRequisitionResponseDto = (
    requisition: any
): StockRequisitionResponseDto => ({
    id: requisition.id,
    requesterJustification:
        requisition.requester_justification,
    status: requisition.status,
    createdAt: requisition.created_at,

    items: requisition.items?.map((item: any) => ({
        productId: item.product?.id,
        quantity: item.quantity,
        delivered: item.delivered,
    })) ?? [],
});

export const toStockRequisitionResponseDtoList = (
    requisitions: any[]
): StockRequisitionResponseDto[] =>
    requisitions.map(toStockRequisitionResponseDto);