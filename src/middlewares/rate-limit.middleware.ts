import { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

function createLimiter(windowMs: number, limit: number, keyByEmail: boolean) {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        skip: () => isTest,
        message: { message: "Too many attempts. Please try again later." },
        keyGenerator: (req: Request) => {
            const ip = ipKeyGenerator(req.ip ?? "");
            const email = keyByEmail ? (req.body as { email?: unknown } | undefined)?.email : undefined;
            return typeof email === "string" ? `${ip}:${email.toLowerCase()}` : ip;
        },
    });
}

export const loginRateLimit = createLimiter(15 * 60 * 1000, 10, true);
export const forgotPasswordRateLimit = createLimiter(15 * 60 * 1000, 5, true);
export const resetPasswordRateLimit = createLimiter(15 * 60 * 1000, 10, false);
export const refreshRateLimit = createLimiter(60 * 1000, 30, false);
