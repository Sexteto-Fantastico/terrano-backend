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

async function login(req: Request<{}, LoginResponse, LoginBody>, res: Response<LoginResponse>) {
    const result = await AuthService.login(req.body.email, req.body.password);
    res.json(result);
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

    await AuthService.definePassword(user.id, req.body.password);
    res.json({ message: "Password has been updated successfully." });
}

async function getMe(req: AuthenticatedRequest, res: Response<MeResponse>) {
    const user = req.user;
    if (!user) {
        throw new Error("Authenticated user not found");
    }

    const result = await AuthService.getMe(user.id);
    res.json(toMeResponse(result));
}

export { login, forgotPassword, resetPassword, definePassword, getMe };
