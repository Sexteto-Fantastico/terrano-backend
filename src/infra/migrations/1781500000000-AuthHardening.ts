import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthHardening1781500000000 implements MigrationInterface {
    name = 'AuthHardening1781500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "token_version" integer NOT NULL DEFAULT (0)`);
        // Reset tokens are stored hashed from now on; plaintext tokens already issued are no longer valid.
        await queryRunner.query(`UPDATE "user" SET "password_reset_token" = NULL, "password_reset_token_expires_at" = NULL`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "token_hash" varchar(64) NOT NULL, "family_id" varchar(64) NOT NULL, "expires_at" datetime NOT NULL, "revoked_at" datetime, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_refresh_token_token_hash" ON "refresh_token" ("token_hash")`);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_token_user_id" ON "refresh_token" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_token_family_id" ON "refresh_token" ("family_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token_version"`);
    }
}
