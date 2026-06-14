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

const AddressSchema = z.object({
    street: z.string().min(1, "Street is required").max(255).openapi({ example: "Rua das Flores" }),
    number: z.string().min(1, "Number is required").max(20).openapi({ example: "123" }),
    neighborhood: z.string().min(1, "Neighborhood is required").max(100).openapi({ example: "Centro" }),
    city: z.string().min(1, "City is required").max(100).openapi({ example: "São Paulo" }),
    state: z.string().min(1, "State is required").max(100).openapi({ example: "SP" }),
    country: z.string().min(1, "Country is required").max(100).openapi({ example: "Brasil" }),
    complement: z.string().max(255).optional().openapi({ example: "Sala 101" }),
});

const PartialAddressSchema = z.object({
    street: z.string().min(1).max(255).optional().openapi({ example: "Rua das Flores" }),
    number: z.string().min(1).max(20).optional().openapi({ example: "123" }),
    neighborhood: z.string().min(1).max(100).optional().openapi({ example: "Centro" }),
    city: z.string().min(1).max(100).optional().openapi({ example: "São Paulo" }),
    state: z.string().min(1).max(100).optional().openapi({ example: "SP" }),
    country: z.string().min(1).max(100).optional().openapi({ example: "Brasil" }),
    complement: z.string().max(255).optional().openapi({ example: "Sala 101" }),
});

export const AddressResponseSchema = registry.register(
    "SupplierAddressResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        street: z.string().openapi({ example: "Rua das Flores" }),
        number: z.string().openapi({ example: "123" }),
        neighborhood: z.string().openapi({ example: "Centro" }),
        city: z.string().openapi({ example: "São Paulo" }),
        state: z.string().openapi({ example: "SP" }),
        country: z.string().openapi({ example: "Brasil" }),
        complement: z.string().nullable().optional().openapi({ example: "Sala 101" }),
    })
);

export const CreateSupplierBodySchema = registry.register(
    "CreateSupplier",
    z.object({
        corporateName: z.string().min(1, "Corporate name is required").max(255).openapi({ example: "Tech Solutions Ltda" }),
        tradeName: z.string().min(1, "Trade name is required").max(255).openapi({ example: "Tech Store" }),
        cnpj: z.string().length(14, "CNPJ must be exactly 14 characters").openapi({ example: "12345678000199" }),
        email: z.string().email("Invalid email format").max(255).openapi({ example: "contato@techstore.com" }),
        phone: z.string().min(1, "Phone is required").max(20).openapi({ example: "11999999999" }),
        address: AddressSchema.optional().openapi({
            example: {
                street: "Rua das Flores",
                number: "123",
                neighborhood: "Centro",
                city: "São Paulo",
                state: "SP",
                country: "Brasil",
                complement: "Sala 101",
            }
        }),
    })
);

export const createSupplierSchema = z.object({ body: CreateSupplierBodySchema });
export type CreateSupplier = z.infer<typeof createSupplierSchema>["body"];

export const UpdateSupplierBodySchema = registry.register(
    "UpdateSupplier",
    z.object({
        corporateName: z.string().min(1, "Corporate name cannot be empty").max(255).optional().openapi({ example: "Tech Solutions Ltda" }),
        tradeName: z.string().min(1, "Trade name cannot be empty").max(255).optional().openapi({ example: "Tech Store" }),
        cnpj: z.string().length(14).optional().openapi({ example: "12345678000199" }),
        email: z.string().email().max(255).optional().openapi({ example: "contato@techstore.com" }),
        phone: z.string().max(20).optional().openapi({ example: "11999999999" }),
        address: PartialAddressSchema.optional().openapi({
            example: {
                street: "Rua das Flores",
                number: "123",
                neighborhood: "Centro",
                city: "São Paulo",
                state: "SP",
                country: "Brasil",
                complement: "Sala 101",
            }
        }),
    })
);

export const updateSupplierSchema = z.object({
    params: SupplierIdSchema.shape.params,
    body: UpdateSupplierBodySchema,
});
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>["body"];

export const SupplierResponseSchema = registry.register(
    "SupplierResponse",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        corporateName: z.string().openapi({ example: "Tech Solutions Ltda" }),
        tradeName: z.string().openapi({ example: "Tech Store" }),
        cnpj: z.string().openapi({ example: "12345678000199" }),
        email: z.string().openapi({ example: "contato@techstore.com" }),
        phone: z.string().openapi({ example: "11999999999" }),
        isActive: z.boolean().openapi({ example: true }),
        address: AddressResponseSchema.nullable().optional(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        deletedAt: z.date().nullable().optional(),
    })
);

export const SupplierDetailResponseSchema = registry.register(
    "SupplierDetailResponse",
    SupplierResponseSchema
);

export type SupplierResponse = z.infer<typeof SupplierResponseSchema>;
export type SupplierDetailResponse = z.infer<typeof SupplierDetailResponseSchema>;

export const toSupplierResponse = (entity: Supplier): SupplierResponse => ({
    id: entity.id as number,
    corporateName: entity.corporate_name,
    tradeName: entity.trade_name,
    cnpj: entity.cnpj,
    email: entity.email,
    phone: entity.phone,
    isActive: !entity.deleted_at,
    address: entity.address ? {
        id: entity.address.id,
        street: entity.address.street,
        number: entity.address.number,
        neighborhood: entity.address.neighborhood,
        city: entity.address.city,
        state: entity.address.state,
        country: entity.address.country,
        complement: entity.address.complement,
    } : null,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    deletedAt: entity.deleted_at ?? null,
});

export const toSupplierResponseList = (list: Supplier[]) => 
    list.map(toSupplierResponse);