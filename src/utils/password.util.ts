import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SALT_BYTES = 16;
const KEY_LENGTH = 32;

export function hashPassword(password: string): string {
    const salt = randomBytes(SALT_BYTES).toString("base64");
    const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("base64");
    return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) {
        return false;
    }

    const derivedKey = scryptSync(password, salt, KEY_LENGTH);
    const storedKey = Buffer.from(hash, "base64");

    if (storedKey.length !== derivedKey.length) {
        return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
}
