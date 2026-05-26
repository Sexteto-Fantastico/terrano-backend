import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/app-error";
import { verifyJwt } from "../utils/jwt.util";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Bearer token missing");
  }

  const token = authorization.replace("Bearer ", "").trim();
  try {
    const payload = verifyJwt(token);
    const authReq = req as AuthenticatedRequest;
    authReq.user = {
      id: payload.userId,
      email: payload.email,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
