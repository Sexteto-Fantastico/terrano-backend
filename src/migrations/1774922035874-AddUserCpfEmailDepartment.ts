import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserCpfEmailDepartment1774922035874 implements MigrationInterface {
    name = 'AddUserCpfEmailDepartment1774922035874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`cpf\` varchar(14) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`department_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_c1c6c6d6961f348b9e9f5f7d17\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_9b3a7f6ce2f7262e8c2472aa90\` FOREIGN KEY (\`department_id\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_9b3a7f6ce2f7262e8c2472aa90\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_c1c6c6d6961f348b9e9f5f7d17\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`department_id\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`cpf\``);
    }
}
