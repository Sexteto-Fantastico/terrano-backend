import { z } from "../../infra/config/openapi";

export const paginationFields = {
    pageIndex: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
    pageSize: z.coerce.number().int().min(1).max(100).optional().openapi({ example: 10 }),
};
