import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN = "1d";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

export interface JwtPayload {
    userId: number;
    email: string;
}

export function signJwt(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function verifyJwt(token: string): JwtPayload {
    const payload = jwt.verify(token, JWT_SECRET) as unknown;
    return payload as JwtPayload;
}
