import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN = "1d";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

export interface JwtPayload {
    sub: number;
}

export function signJwt(payload: { userId: number }): string {
    return jwt.sign({ sub: payload.userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function verifyJwt(token: string): JwtPayload {
    const payload = jwt.verify(token, JWT_SECRET) as unknown;
    return payload as JwtPayload;
}
