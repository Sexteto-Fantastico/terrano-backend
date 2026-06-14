import { RequestHandler } from "express";
import { ForbiddenError } from "../errors/app-error";
import { AuthenticatedRequest } from "./auth.middleware";
import { getUserWithPermissions } from "../repositories/user.repository";

export function requirePermission(resource: string, action: string): RequestHandler {
    return async (req, _res, next) => {
        const authReq = req as AuthenticatedRequest;

        if (!authReq.user?.id) {
            throw new ForbiddenError("User not authenticated");
        }

        const user = await getUserWithPermissions(authReq.user.id);

        if (!user) {
            throw new ForbiddenError("User not found");
        }

        const hasPermission = user.role.policies.some(
            (policy) => policy.resource === resource && policy.action === action,
        );

        if (!hasPermission) {
            throw new ForbiddenError(`Insufficient permissions: ${resource}:${action}`);
        }

        next();
    };
}
