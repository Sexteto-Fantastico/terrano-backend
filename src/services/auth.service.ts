import crypto from "crypto";
import { hashPassword, verifyPassword, verifyDummyPassword } from "../utils/password.util";
import { signJwt } from "../utils/jwt.util";
import { generateOpaqueToken, hashToken } from "../utils/token.util";
import { REFRESH_TOKEN_TTL_MS } from "../utils/auth-cookie.util";
import { sendEmail } from "./email.service";
import { resetPasswordTemplate } from "../types/email/reset-password.template";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import {
    getUserByEmail,
    getUserByPasswordResetToken,
    getUserById as repoGetUserById,
    updateUser as repoUpdateUser,
} from "../repositories/user.repository";
import {
    createRefreshToken,
    getRefreshTokenByHash,
    revokeAllUserRefreshTokens,
    revokeRefreshToken,
    revokeRefreshTokenFamily,
} from "../repositories/refresh-token.repository";
import { User } from "../infra/entities/user.entity";

const RESET_TOKEN_EXPIRES_IN_MS = 1000 * 60 * 60;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

interface LoginResult {
    token: string;
    expiresAt: string;
    mustResetPassword: boolean;
}

interface Session {
    result: LoginResult;
    refreshToken: string;
}

async function startSession(user: User, familyId: string = crypto.randomUUID()): Promise<Session> {
    const { token, expiresAt } = signJwt({ userId: user.id, tokenVersion: user.token_version ?? 0 });

    const refreshToken = generateOpaqueToken();
    await createRefreshToken({
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        family_id: familyId,
        expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    return {
        result: { token, expiresAt, mustResetPassword: !!user.requires_password_reset },
        refreshToken,
    };
}

// Bumps the token version (kills every issued access token) and revokes all refresh tokens.
// The caller is responsible for persisting the user afterwards.
async function invalidateSessions(user: User): Promise<void> {
    user.token_version = (user.token_version ?? 0) + 1;
    await revokeAllUserRefreshTokens(user.id);
}

async function login(email: string, password: string): Promise<Session> {
    const user = await getUserByEmail(email);
    if (!user || user.deleted_at) {
        await verifyDummyPassword(password);
        throw new UnauthorizedError("Invalid credentials.");
    }

    if (!(await verifyPassword(password, user.password))) {
        throw new UnauthorizedError("Invalid credentials.");
    }

    return startSession(user);
}

async function refresh(refreshToken: string): Promise<Session> {
    const stored = await getRefreshTokenByHash(hashToken(refreshToken));
    if (!stored) {
        throw new UnauthorizedError("Invalid refresh token.");
    }

    // A rotated token being presented again means it was stolen: kill the whole family.
    if (stored.revoked_at) {
        await revokeRefreshTokenFamily(stored.family_id);
        throw new UnauthorizedError("Invalid refresh token.");
    }

    if (stored.expires_at < new Date()) {
        await revokeRefreshToken(stored.id);
        throw new UnauthorizedError("Refresh token expired.");
    }

    const user = await repoGetUserById(stored.user_id);
    if (!user) {
        await revokeRefreshTokenFamily(stored.family_id);
        throw new UnauthorizedError("Invalid refresh token.");
    }

    await revokeRefreshToken(stored.id);
    return startSession(user, stored.family_id);
}

async function logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
        return;
    }

    const stored = await getRefreshTokenByHash(hashToken(refreshToken));
    if (stored) {
        await revokeRefreshTokenFamily(stored.family_id);
    }
}

async function forgotPassword(email: string): Promise<void> {
    const user = await getUserByEmail(email);
    if (!user || user.deleted_at) {
        return;
    }

    const token = generateOpaqueToken();
    user.password_reset_token = hashToken(token);
    user.password_reset_token_expires_at = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN_MS);
    await repoUpdateUser(user);

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

    // Delivery failures must not change the response, otherwise they reveal which e-mails exist.
    try {
        await sendEmail({
            to: user.email,
            template: resetPasswordTemplate({ resetLink }),
        });
    } catch (error) {
        console.error("[AUTH] Failed to send password reset e-mail:", error instanceof Error ? error.message : error);
    }
}

async function resetPassword(token: string, password: string): Promise<void> {
    const user = await getUserByPasswordResetToken(hashToken(token));
    if (!user || !user.password_reset_token_expires_at || user.password_reset_token_expires_at < new Date()) {
        throw new BadRequestError("Invalid or expired reset token.");
    }

    user.password = await hashPassword(password);
    user.requires_password_reset = false;
    user.password_reset_token = undefined;
    user.password_reset_token_expires_at = undefined;
    await invalidateSessions(user);
    await repoUpdateUser(user);
}

async function definePassword(userId: number, password: string, currentPassword?: string): Promise<Session> {
    const user = await repoGetUserById(userId);
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    // The forced first-access flow has no current password to ask for; a voluntary change does.
    if (!user.requires_password_reset) {
        if (!currentPassword || !(await verifyPassword(currentPassword, user.password))) {
            throw new BadRequestError("Current password is incorrect.");
        }
    }

    user.password = await hashPassword(password);
    user.requires_password_reset = false;
    user.password_reset_token = undefined;
    user.password_reset_token_expires_at = undefined;
    await invalidateSessions(user);
    await repoUpdateUser(user);

    return startSession(user);
}

async function getMe(userId: number) {
    const user = await repoGetUserById(userId);
    if (!user) {
        throw new NotFoundError("User not found.");
    }
    return user;
}

export { login, refresh, logout, forgotPassword, resetPassword, definePassword, getMe, invalidateSessions };
export type { Session, LoginResult };
