import { z } from "zod";
import { registry } from "../infra/config/openapi";
import { paginationFields, activeOnlyField, idParamSchema } from "./common/pagination.dto";
import { Supplier } from "../infra/entities/supplier.entity";

export const SupplierIdSchema = idParamSchema;

export const SupplierQuerySchema = z.object({
    query: z.object({
        ...paginationFields,
        corporateName: z.string().optional(),
        tradeName: z.string().optional(),
        cnpj: z.string().optional(),
        activeOnly: activeOnlyField,
    })
});
export type SupplierQuery = z.infer<typeof SupplierQuerySchema>["query"];

export const CreateSupplierBodySchema = registry.register(
    "CreateSupplier",
    z.object({
        corporateName: z.string().min(1, "Corporate name is required").max(255).openapi({ example: "Tech Solutions Ltda" }),
        tradeName: z.string().min(1, "Trade name is required").max(255).openapi({ example: "Tech Store" }),
        cnpj: z.string().length(14, "CNPJ must be exactly 14 characters").openapi({ example: "12345678000199" }),
        email: z.string().email("Invalid email format").max(255).openapi({ example: "contato@techstore.com" }),
        phone: z.string().min(1, "Phone is required").max(20).openapi({ example: "11999999999" }),
    })
);

export const createSupplierSchema = z.object({ body: CreateSupplierBodySchema });
export type CreateSupplierBody = z.infer<typeof createSupplierSchema>["body"];

export const UpdateSupplierBodySchema = registry.register(
    "UpdateSupplier",
    z.object({
        corporateName: z.string().max(255).optional().openapi({ example: "Tech Solutions S.A." }),
        tradeName: z.string().max(255).optional().openapi({ example: "Tech Store Premium" }),
        cnpj: z.string().length(14).optional().openapi({ example: "12345678000199" }),
        email: z.string().email().max(255).optional().openapi({ example: "novoemail@techstore.com" }),
        phone: z.string().max(20).optional().openapi({ example: "11888888888" }),
    })
);

export const updateSupplierSchema = z.object({
    params: SupplierIdSchema.shape.params,
    body: UpdateSupplierBodySchema,
});
export type UpdateSupplierBody = z.infer<typeof updateSupplierSchema>["body"];


export const SupplierResponseSchema = registry.register(
    "SupplierResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        corporateName: z.string().openapi({ example: "Tech Solutions Ltda" }),
        tradeName: z.string().openapi({ example: "Tech Store" }),
        cnpj: z.string().openapi({ example: "12345678000199" }),
        email: z.string().openapi({ example: "contato@techstore.com" }),
        phone: z.string().openapi({ example: "11999999999" }),
        address: z.any().optional(), // Pode substituir por um AddressResponseSchema se tiver
        isActive: z.boolean().openapi({ example: true }),
        createdAt: z.date().optional().openapi({ type: "string", format: "date-time" }),
        updatedAt: z.date().optional().openapi({ type: "string", format: "date-time" }),
        deletedAt: z.date().optional().openapi({ type: "string", format: "date-time" }),
    })
);

export type SupplierResponse = z.infer<typeof SupplierResponseSchema>;

export const toSupplierResponse = (supplier: Supplier): SupplierResponse => ({
    id: supplier.id as number,
    corporateName: supplier.corporate_name,
    tradeName: supplier.trade_name,
    cnpj: supplier.cnpj,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    isActive: !supplier.deleted_at,
    createdAt: supplier.created_at,
    updatedAt: supplier.updated_at,
    deletedAt: supplier.deleted_at,
});

export const toSupplierResponseList = (list: Supplier[]): SupplierResponse[] =>
    list.map(toSupplierResponse);