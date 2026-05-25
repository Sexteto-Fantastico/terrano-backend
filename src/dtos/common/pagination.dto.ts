import { z } from "../../infra/config/openapi";

export const paginationFields = {
    pageIndex: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
    pageSize: z.coerce.number().int().min(1).max(100).optional().openapi({ example: 10 }),
    sortBy: z.string().optional().openapi({ example: "name" }),
    sortOrder: z.enum(["asc", "desc"]).optional().openapi({ example: "asc" }),
};

export interface PaginationQuery {
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
