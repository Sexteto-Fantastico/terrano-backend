import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { handleDatabaseError } from "../errors/database-error-handler";
import { ILogger, LogLevel } from "../infra/logger";
import { DatabaseLogger } from "../infra/logger";

interface ErrorResponse {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
}

const logger: ILogger = new DatabaseLogger();

export function globalErrorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const timestamp = new Date().toISOString();
    const path = req.originalUrl;
    const method = req.method;

    const dbError = handleDatabaseError(err);
    if (dbError) {
        const response: ErrorResponse = {
            statusCode: dbError.statusCode,
            message: dbError.message,
            timestamp,
            path,
        };

        logger.log({
            level: LogLevel.WARN,
            message: dbError.message,
            statusCode: dbError.statusCode,
            isOperational: true,
            path,
            method,
            metadata: {
                errorType: "DATABASE",
                originalError: err.message,
            },
        });

        res.status(dbError.statusCode).json(response);
        return;
    }

    if (err instanceof AppError) {
        const response: ErrorResponse = {
            statusCode: err.statusCode,
            message: err.message,
            timestamp,
            path,
        };

        logger.log({
            level: err.isOperational ? LogLevel.WARN : LogLevel.ERROR,
            message: err.message,
            statusCode: err.statusCode,
            isOperational: err.isOperational,
            stack: err.stack,
            path,
            method,
            metadata: {
                errorType: "APPLICATION",
            },
        });

        res.status(err.statusCode).json(response);
        return;
    }

    if (err instanceof SyntaxError && "body" in err) {
        const response: ErrorResponse = {
            statusCode: 400,
            message: "Invalid JSON in request body.",
            timestamp,
            path,
        };

        logger.log({
            level: LogLevel.WARN,
            message: "Invalid JSON in request body.",
            statusCode: 400,
            isOperational: true,
            path,
            method,
            metadata: {
                errorType: "PARSE",
            },
        });

        res.status(400).json(response);
        return;
    }

    console.error("[UNEXPECTED ERROR]", {
        message: err.message,
        stack: err.stack,
        path,
        method,
        timestamp,
    });

    logger.log({
        level: LogLevel.FATAL,
        message: err.message,
        statusCode: 500,
        isOperational: false,
        stack: err.stack,
        path,
        method,
        metadata: {
            errorType: "UNEXPECTED",
        },
    });

    const response: ErrorResponse = {
        statusCode: 500,
        message: "An unexpected internal error occurred.",
        timestamp,
        path,
    };

    res.status(500).json(response);
}
