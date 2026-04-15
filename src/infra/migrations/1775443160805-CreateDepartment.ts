import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartment1775443160805 implements MigrationInterface {
    name = 'CreateDepartment1775443160805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`deleted_at\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`deleted_at\``);
    }

}
