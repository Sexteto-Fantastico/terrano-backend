import "express";

declare global {
    namespace Express {
        interface Request {
            pagination: {
                page: number;
                limit: number;
                offset: number;
            };
        }

        interface Response {
            setPaginationHeaders(total: number): void;
        }
    }
}
