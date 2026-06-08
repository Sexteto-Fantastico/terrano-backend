import { z, registry } from "../infra/config/openapi";
import { RequisitionStatus } from "../infra/entities/stock-requisition.entity";
import { paginationFields } from "./common/pagination.dto"

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

export const UpdateStockRequisitionStatusBodySchema = registry.register(
    "UpdateStockRequisitionStatusDto",
    z.object({
        status: z.nativeEnum(RequisitionStatus),
        changeJustification: z.string().optional(),
    })
);

export const updateStockRequisitionStatusSchema = z.object({
    params: stockRequisitionIdSchema.shape.params,
    body: UpdateStockRequisitionStatusBodySchema,
});

export type UpdateStockRequisitionStatusDto =
    z.infer<typeof updateStockRequisitionStatusSchema>["body"];

export const stockRequisitionQuerySchema = z.object({
    query: z.object({
        ...paginationFields,          
        status: z.nativeEnum(RequisitionStatus).optional(),
        openOnly: z.coerce.boolean().optional(),
        activeOnly: z.coerce.boolean().optional(),
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
        department: z.object({
            id: z.number().int(),
            name: z.string(),
        }).nullable().optional(),
        items: z.array(
            z.object({
                productId: z.number().int(),
                productName: z.string().optional(),
                quantity: z.number().int(),
                delivered: z.boolean(),
            })
        ),
        statusLogs: z.array(
            z.object({
                id: z.number().int(),
                previousStatus: z.nativeEnum(RequisitionStatus).nullable().optional(),
                currentStatus: z.nativeEnum(RequisitionStatus),
                changeJustification: z.string().nullable().optional(),
                createdAt: z.date(),
            })
        ).optional(),
    })
);

export class StockRequisitionResponseDto {
    id!: number;
    requesterJustification!: string;
    status!: RequisitionStatus;
    createdAt!: Date;
    department?: { id: number; name: string } | null;
    items!: {
        productId: number;
        productName?: string;
        quantity: number;
        delivered: boolean;
    }[];
    statusLogs?: {
        id: number;
        previousStatus?: RequisitionStatus | null;
        currentStatus: RequisitionStatus;
        changeJustification?: string | null;
        createdAt: Date;
    }[];
}

export const toStockRequisitionResponseDto = (
    requisition: any
): StockRequisitionResponseDto => ({
    id: requisition.id,
    requesterJustification: requisition.requester_justification,
    status: requisition.status,
    createdAt: requisition.created_at,
    department: requisition.department
        ? { id: requisition.department.id, name: requisition.department.name }
        : null,
    items: requisition.items?.map((item: any) => ({
        productId: item.product?.id,
        productName: item.product?.name,
        quantity: item.quantity,
        delivered: item.delivered,
    })) ?? [],
    statusLogs: requisition.status_logs?.map((log: any) => ({
        id: log.id,
        previousStatus: log.previous_status ?? null,
        currentStatus: log.current_status,
        changeJustification: log.change_justification ?? null,
        createdAt: log.created_at,
    })) ?? [],
});

export const toStockRequisitionResponseDtoList = (
    requisitions: any[]
): StockRequisitionResponseDto[] =>
    requisitions.map(toStockRequisitionResponseDto);