import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductBrand1775363761584 implements MigrationInterface {
    name = 'CreateProductBrand1775363761584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`deleted_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, UNIQUE INDEX \`IDX_aacf9270b7050ef2a350e9a913\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`brand_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_2eb5ce4324613b4b457c364f4a2\` FOREIGN KEY (\`brand_id\`) REFERENCES \`product_brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_2eb5ce4324613b4b457c364f4a2\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`brand_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_aacf9270b7050ef2a350e9a913\` ON \`product_brand\``);
        await queryRunner.query(`DROP TABLE \`product_brand\``);
    }

}
