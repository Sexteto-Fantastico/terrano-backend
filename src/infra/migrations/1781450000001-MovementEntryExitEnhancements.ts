import { MigrationInterface, QueryRunner } from "typeorm";

export class MovementEntryExitEnhancements1781450000001 implements MigrationInterface {
    name = 'MovementEntryExitEnhancements1781450000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movement_entry" ADD COLUMN "internal_notes" text`);
        await queryRunner.query(`ALTER TABLE "movement_exit" ADD COLUMN "nf_number" varchar(50)`);
        await queryRunner.query(`ALTER TABLE "movement_exit" ADD COLUMN "nf_serie" varchar(50)`);
        await queryRunner.query(`ALTER TABLE "movement_exit" ADD COLUMN "movement_entry_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // SQLite does not support DROP COLUMN; recreating tables would be needed for full rollback
        // For development purposes, these changes are left as-is on revert
    }
}
