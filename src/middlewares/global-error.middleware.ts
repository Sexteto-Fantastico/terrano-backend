import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { handleDatabaseError } from "../errors/database-error-handler";

interface ErrorResponse {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
}

export function globalErrorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const dbError = handleDatabaseError(err);
    if (dbError) {
        const response: ErrorResponse = {
            statusCode: dbError.statusCode,
            message: dbError.message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        };

        res.status(dbError.statusCode).json(response);
        return;
    }

    if (err instanceof AppError) {
        const response: ErrorResponse = {
            statusCode: err.statusCode,
            message: err.message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        };

        res.status(err.statusCode).json(response);
        return;
    }

    if (err instanceof SyntaxError && "body" in err) {
        const response: ErrorResponse = {
            statusCode: 400,
            message: "Invalid JSON in request body.",
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        };

        res.status(400).json(response);
        return;
    }

    console.error("[UNEXPECTED ERROR]", {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    const response: ErrorResponse = {
        statusCode: 500,
        message: "An unexpected internal error occurred.",
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
    };

    res.status(500).json(response);
}
