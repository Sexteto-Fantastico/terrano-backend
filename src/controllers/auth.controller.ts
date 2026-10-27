import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import {
    DefinePasswordBody,
    ForgotPasswordBody,
    LoginBody,
    LoginResponse,
    MeResponse,
    ResetPasswordBody,
    toMeResponse,
} from "../dtos/auth.dto";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UnauthorizedError } from "../errors";
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from "../utils/auth-cookie.util";

async function login(req: Request<{}, LoginResponse, LoginBody>, res: Response<LoginResponse>) {
    const session = await AuthService.login(req.body.email, req.body.password);
    setRefreshCookie(res, session.refreshToken);
    res.json(session.result);
}

async function refresh(req: Request, res: Response<LoginResponse>) {
    const refreshToken = readRefreshCookie(req);
    if (!refreshToken) {
        throw new UnauthorizedError("Refresh token missing.");
    }

    try {
        const session = await AuthService.refresh(refreshToken);
        setRefreshCookie(res, session.refreshToken);
        res.json(session.result);
    } catch (error) {
        clearRefreshCookie(res);
        throw error;
    }
}

async function logout(req: Request, res: Response) {
    await AuthService.logout(readRefreshCookie(req));
    clearRefreshCookie(res);
    res.status(204).send();
}

async function forgotPassword(req: Request<{}, unknown, ForgotPasswordBody>, res: Response) {
    await AuthService.forgotPassword(req.body.email);
    res.json({ message: "If a matching account exists, a password reset link has been sent." });
}

async function resetPassword(req: Request<{}, unknown, ResetPasswordBody>, res: Response) {
    await AuthService.resetPassword(req.body.token, req.body.password);
    res.json({ message: "Password has been reset successfully." });
}

async function definePassword(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    if (!user) {
        throw new Error("Authenticated user not found");
    }

    const body = req.body as DefinePasswordBody;
    const session = await AuthService.definePassword(user.id, body.password, body.currentPassword);
    setRefreshCookie(res, session.refreshToken);
    res.json({ message: "Password has been updated successfully.", ...session.result });
}

async function getMe(req: AuthenticatedRequest, res: Response<MeResponse>) {
    const user = req.user;
    if (!user) {
        throw new Error("Authenticated user not found");
    }

    const result = await AuthService.getMe(user.id);
    res.json(toMeResponse(result));
}

export { login, refresh, logout, forgotPassword, resetPassword, definePassword, getMe };
