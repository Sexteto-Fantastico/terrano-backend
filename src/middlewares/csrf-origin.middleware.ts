import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/app-error";

// Defense in depth for cookie-authenticated endpoints, on top of the SameSite attribute.
export function requireTrustedOrigin(req: Request, _res: Response, next: NextFunction): void {
    const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
    const origin = req.headers.origin;

    if (origin && origin !== allowedOrigin) {
        throw new ForbiddenError("Untrusted origin.");
    }

    next();
}
