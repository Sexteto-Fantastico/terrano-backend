import { z } from "../../infra/config/openapi";

// bcrypt only hashes the first 72 bytes, so longer inputs would be silently truncated.
const MAX_PASSWORD_BYTES = 72;

export const PasswordSchema = z
    .string()
    .min(8, "Password must have at least 8 characters")
    .refine((value) => Buffer.byteLength(value, "utf8") <= MAX_PASSWORD_BYTES, {
        message: `Password must have at most ${MAX_PASSWORD_BYTES} bytes`,
    })
    .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
        message: "Password must contain at least one letter and one number",
    });
