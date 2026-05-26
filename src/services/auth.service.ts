import crypto from "crypto";
import { hashPassword, verifyPassword } from "../utils/password.util";
import { signJwt } from "../utils/jwt.util";
import { sendEmail } from "./email.service";
import { resetPasswordTemplate } from "../types/email/reset-password.template";
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
  mustResetPassword: boolean;
}

async function login(email: string, password: string): Promise<LoginResult> {
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
    mustResetPassword: !!user.requires_password_reset,
  };
}

async function forgotPassword(email: string): Promise<void> {
  const user = await getUserByEmail(email);
  if (!user || !user.is_active) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.password_reset_token = token;
  user.password_reset_token_expires_at = new Date(
    Date.now() + RESET_TOKEN_EXPIRES_IN_MS
  );
  await repoUpdateUser(user);

  const resetLink = `${FRONTEND_URL}/defina-sua-senha?token=${token}`;
  await sendEmail({
    to: user.email,
    template: resetPasswordTemplate({ resetLink }),
  });
}

async function resetPassword(token: string, password: string): Promise<void> {
  const user = await getUserByPasswordResetToken(token);
  if (
    !user ||
    !user.password_reset_token_expires_at ||
    user.password_reset_token_expires_at < new Date()
  ) {
    throw new BadRequestError("Invalid or expired reset token.");
  }

  user.password = hashPassword(password);
  user.requires_password_reset = false;
  user.password_reset_token = undefined;
  user.password_reset_token_expires_at = undefined;
  await repoUpdateUser(user);
}

async function definePassword(userId: number, password: string): Promise<void> {
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
