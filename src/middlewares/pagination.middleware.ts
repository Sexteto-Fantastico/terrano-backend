import { Request, Response, NextFunction } from "express";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function paginationMiddleware(req: Request, res: Response, next: NextFunction): void {
    let pageIndex = parseInt(req.query.pageIndex as string, 10) || DEFAULT_PAGE;
    pageIndex = Math.max(pageIndex, 1);

    let pageLimit = parseInt(req.query.pageLimit as string, 10) || DEFAULT_LIMIT;
    pageLimit = Math.max(1, Math.min(pageLimit, MAX_LIMIT));

    const offset = (pageIndex - 1) * pageLimit;

    req.pagination = {
        page: pageIndex,
        limit: pageLimit,
        offset,
    };

    res.setPaginationHeaders = (total: number): void => {
        const totalPages = Math.ceil(total / pageLimit);

        res.set("X-Total-Count", total.toString());
        res.set("X-Total-Pages", totalPages.toString());
        res.set("X-Page", pageIndex.toString());
        res.set("X-Limit", pageLimit.toString());
    };

    next();
}
