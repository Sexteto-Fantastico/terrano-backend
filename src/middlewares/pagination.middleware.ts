import { Request, Response, NextFunction } from "express";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export function paginationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const pageIndex = Number(req.query.pageIndex) || DEFAULT_PAGE;
    const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;

    const offset = (pageIndex - 1) * pageSize;

    req.pagination = {
        page: pageIndex,
        limit: pageSize,
        offset,
    };

    res.setPaginationHeaders = (total: number): void => {
        const totalPages = Math.ceil(total / pageSize);

        res.set("X-Total-Count", total.toString());
        res.set("X-Total-Pages", totalPages.toString());
        res.set("X-Page", pageIndex.toString());
        res.set("X-Limit", pageSize.toString());
    };

    next();
}
