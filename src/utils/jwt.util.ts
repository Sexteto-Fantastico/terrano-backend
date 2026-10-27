import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_ISSUER = "terrano-api";
const JWT_AUDIENCE = "terrano-web";
const MIN_SECRET_LENGTH = 32;
const PLACEHOLDER_SECRETS = ["your_jwt_secret_key", "secret", "changeme"];

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

if (process.env.NODE_ENV !== "test") {
    if (JWT_SECRET.length < MIN_SECRET_LENGTH || PLACEHOLDER_SECRETS.includes(JWT_SECRET)) {
        throw new Error(`JWT_SECRET must be a random string with at least ${MIN_SECRET_LENGTH} characters`);
    }
}

export interface JwtPayload {
    sub: number;
    tv: number;
}

export interface SignedJwt {
    token: string;
    expiresAt: string;
}

export function signJwt(payload: { userId: number; tokenVersion: number }): SignedJwt {
    const token = jwt.sign({ tv: payload.tokenVersion }, JWT_SECRET, {
        algorithm: "HS256",
        subject: String(payload.userId),
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });

    const { exp } = jwt.decode(token) as { exp: number };
    return { token, expiresAt: new Date(exp * 1000).toISOString() };
}

export function verifyJwt(token: string): JwtPayload {
    const payload = jwt.verify(token, JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    }) as jwt.JwtPayload;

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || typeof payload.tv !== "number") {
        throw new Error("Malformed token payload");
    }

    return { sub: userId, tv: payload.tv };
}
