import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/app-error";
import { verifyJwt } from "../utils/jwt.util";
import { getUserAuthState } from "../repositories/user.repository";
import { asyncLocalStorage } from "../utils/request-context";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}

// Routes a user can still reach while a password reset is pending.
const PASSWORD_RESET_ALLOWED_PATHS = new Set([
    "/api/auth/me",
    "/api/auth/define-password",
    "/api/users/me/permissions",
]);

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new UnauthorizedError("Bearer token missing");
    }

    const token = authorization.slice("Bearer ".length).trim();

    let payload: ReturnType<typeof verifyJwt>;
    try {
        payload = verifyJwt(token);
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }

    // Deleted users and tokens issued before a password change/deactivation are rejected here.
    const user = await getUserAuthState(payload.sub);
    if (!user || user.token_version !== payload.tv) {
        throw new UnauthorizedError("Invalid or expired token");
    }

    const path = req.originalUrl.split("?")[0].replace(/\/+$/, "");
    if (user.requires_password_reset && !PASSWORD_RESET_ALLOWED_PATHS.has(path)) {
        throw new ForbiddenError("Password reset required.");
    }

    (req as AuthenticatedRequest).user = { id: user.id };

    const store = asyncLocalStorage.getStore();
    if (store) {
        store.userId = user.id;
    }

    next();
}
