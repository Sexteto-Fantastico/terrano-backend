import { z, registry } from "../infra/config/openapi";
import { MaterialRequestStatus } from "../infra/entities/material-request.entity";

export const materialRequestIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    })
});

export const CreateMaterialRequestBodySchema = registry.register(
    "CreateMaterialRequestDto",
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

export const createMaterialRequestSchema = z.object({
    body: CreateMaterialRequestBodySchema
});

export type CreateMaterialRequestDto =
    z.infer<typeof createMaterialRequestSchema>["body"];

export const UpdateMaterialRequestBodySchema = registry.register(
    "UpdateMaterialRequestDto",
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

export const updateMaterialRequestSchema = z.object({
    params: materialRequestIdSchema.shape.params,
    body: UpdateMaterialRequestBodySchema
});

export type UpdateMaterialRequestDto =
    z.infer<typeof updateMaterialRequestSchema>["body"];

export const materialRequestQuerySchema = z.object({
    query: z.object({
        status: z.nativeEnum(MaterialRequestStatus).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        openOnly: z.enum(["true", "false", ""])
            .transform(v => v === "true")
            .optional(),
    })
});

export const MaterialRequestResponseSchema = registry.register(
    "MaterialRequestResponseDto",
    z.object({
        id: z.number().int(),
        requesterJustification: z.string(),
        status: z.nativeEnum(MaterialRequestStatus),
        createdAt: z.date(),

        items: z.array(
            z.object({
                productId: z.number().int(),
                quantity: z.number().int(),
                delivered: z.boolean()
            })
        )
    })
);

export class MaterialRequestResponseDto {
    id!: number;
    requesterJustification!: string;
    status!: MaterialRequestStatus;
    createdAt!: Date;

    items!: {
        productId: number;
        quantity: number;
        delivered: boolean;
    }[];
}

export const toMaterialRequestResponseDto = (
    request: any
): MaterialRequestResponseDto => ({
    id: request.id,
    requesterJustification: request.requester_justification,
    status: request.status,
    createdAt: request.created_at,

    items: request.items?.map((item: any) => ({
        productId: item.product?.id,
        quantity: item.quantity,
        delivered: item.delivered,
    })) ?? [],
});

export const toMaterialRequestResponseDtoList = (
    requests: any[]
): MaterialRequestResponseDto[] =>
    requests.map(toMaterialRequestResponseDto);