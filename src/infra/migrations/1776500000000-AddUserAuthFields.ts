import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAuthFields1776500000000 implements MigrationInterface {
    name = 'AddUserAuthFields1776500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`requires_password_reset\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password_reset_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password_reset_token_expires_at\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password_reset_token_expires_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password_reset_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`requires_password_reset\``);
    }
}
