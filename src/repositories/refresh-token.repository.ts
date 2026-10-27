import { IsNull } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { RefreshToken } from "../infra/entities/refresh-token.entity";

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

async function createRefreshToken(data: Pick<RefreshToken, "user_id" | "token_hash" | "family_id" | "expires_at">): Promise<RefreshToken> {
    return await refreshTokenRepository.save(refreshTokenRepository.create(data));
}

async function getRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    return await refreshTokenRepository.findOne({ where: { token_hash: tokenHash } });
}

async function revokeRefreshToken(id: number): Promise<void> {
    await refreshTokenRepository.update({ id, revoked_at: IsNull() }, { revoked_at: new Date() });
}

async function revokeRefreshTokenFamily(familyId: string): Promise<void> {
    await refreshTokenRepository.update({ family_id: familyId, revoked_at: IsNull() }, { revoked_at: new Date() });
}

async function revokeAllUserRefreshTokens(userId: number): Promise<void> {
    await refreshTokenRepository.update({ user_id: userId, revoked_at: IsNull() }, { revoked_at: new Date() });
}

export {
    createRefreshToken,
    getRefreshTokenByHash,
    revokeRefreshToken,
    revokeRefreshTokenFamily,
    revokeAllUserRefreshTokens,
};
