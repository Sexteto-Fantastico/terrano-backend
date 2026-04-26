import crypto from "crypto";
import { hashPassword, verifyPassword } from "../utils/password.util";
import { signJwt } from "../utils/jwt.util";
import { sendResetPasswordEmail } from "../utils/email.util";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import {
    getUserByEmail,
    getUserByPasswordResetToken,
    getUserById as repoGetUserById,
    updateUser as repoUpdateUser,
} from "../repositories/user.repository";

const RESET_TOKEN_EXPIRES_IN_MS = 1000 * 60 * 60;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

interface LoginResult {
    token: string;
    expiresAt: string;
    must_reset_password: boolean;
}

async function login(email: string, password: string): Promise<LoginResult> {
    if (!email || !password) {
        throw new BadRequestError("Email and password are required.");
    }

    const user = await getUserByEmail(email);
    if (!user || !user.is_active) {
        throw new UnauthorizedError("Invalid credentials.");
    }

    if (!verifyPassword(password, user.password)) {
        throw new UnauthorizedError("Invalid credentials.");
    }

    const token = signJwt({ userId: user.id, email: user.email });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
        token,
        expiresAt,
        must_reset_password: !!user.requires_password_reset,
    };
}

async function forgotPassword(email: string): Promise<void> {
    if (!email) {
        throw new BadRequestError("Email is required.");
    }

    const user = await getUserByEmail(email);
    if (!user || !user.is_active) {
        return;
    }
console.log(user.id, user.email);
    const token = crypto.randomBytes(32).toString("hex");
    user.password_reset_token = token;
    user.password_reset_token_expires_at = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN_MS);
    await repoUpdateUser(user);
console.log(token);

    const resetLink = `${FRONTEND_URL}/defina-sua-senha?token=${token}`;
    await sendResetPasswordEmail({ to: user.email, resetLink });
}

async function resetPassword(token: string, password: string): Promise<void> {
    if (!token || !password) {
        throw new BadRequestError("Token and password are required.");
    }

    const user = await getUserByPasswordResetToken(token);
    if (!user || !user.password_reset_token_expires_at || user.password_reset_token_expires_at < new Date()) {
        throw new BadRequestError("Invalid or expired reset token.");
    }

    user.password = hashPassword(password);
    user.requires_password_reset = false;
    user.password_reset_token = undefined;
    user.password_reset_token_expires_at = undefined;
    await repoUpdateUser(user);
}

async function definePassword(userId: number, password: string): Promise<void> {
    if (!password) {
        throw new BadRequestError("Password is required.");
    }

    const user = await repoGetUserById(userId, true);
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    user.password = hashPassword(password);
    user.requires_password_reset = false;
    user.password_reset_token = undefined;
    user.password_reset_token_expires_at = undefined;
    await repoUpdateUser(user);
}

export { login, forgotPassword, resetPassword, definePassword };
