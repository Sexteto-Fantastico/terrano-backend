import { AsyncLocalStorage } from "async_hooks";
import { Request, Response, NextFunction } from "express";

type Store = {
    userId?: number;
};

export const asyncLocalStorage = new AsyncLocalStorage<Store>();

export function getRequestContext(): Store {
    return asyncLocalStorage.getStore() || {};
}

export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;

    asyncLocalStorage.run({ userId }, () => {
        next();
    });
}