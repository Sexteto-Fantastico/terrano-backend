import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSystemLog1776018415903 implements MigrationInterface {
    name = 'CreateSystemLog1776018415903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`system_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` enum ('INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL DEFAULT 'ERROR', \`message\` varchar(1000) NOT NULL, \`status_code\` int NOT NULL, \`is_operational\` tinyint NOT NULL DEFAULT 1, \`stack\` text NULL, \`path\` varchar(500) NULL, \`method\` varchar(10) NULL, \`metadata\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`system_log\``);
    }

}
