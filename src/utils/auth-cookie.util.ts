import { CookieOptions, Request, Response } from "express";
import { Endpoints } from "./constants/endpoints";

export const REFRESH_COOKIE_NAME = "terrano_refresh";
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type SameSite = "strict" | "lax" | "none";

function getSameSite(): SameSite {
    const value = (process.env.COOKIE_SAMESITE || "strict").toLowerCase();
    return value === "lax" || value === "none" ? value : "strict";
}

function getCookieOptions(): CookieOptions {
    const sameSite = getSameSite();
    return {
        httpOnly: true,
        // SameSite=None is only accepted by browsers together with Secure.
        secure: process.env.NODE_ENV === "production" || sameSite === "none",
        sameSite,
        path: Endpoints.AUTH.BASE,
    };
}

export function setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE_NAME, token, { ...getCookieOptions(), maxAge: REFRESH_TOKEN_TTL_MS });
}

export function clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, getCookieOptions());
}

export function readRefreshCookie(req: Request): string | undefined {
    const value = (req.cookies as Record<string, unknown> | undefined)?.[REFRESH_COOKIE_NAME];
    return typeof value === "string" && value.length > 0 ? value : undefined;
}
