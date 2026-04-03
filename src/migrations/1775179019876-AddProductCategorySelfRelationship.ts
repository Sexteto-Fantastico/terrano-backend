import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductCategorySelfRelationship1775179019876 implements MigrationInterface {
    name = 'AddProductCategorySelfRelationship1775179019876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_9b3a7f6ce2f7262e8c2472aa90\``);
        await queryRunner.query(`DROP INDEX \`IDX_c1c6c6d6961f348b9e9f5f7d17\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`stock_location\` CHANGE \`is_active\` \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`supplier\` CHANGE \`is_active\` \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`is_active\` \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`product_category\` DROP COLUMN \`is_active\``);
        await queryRunner.query(`ALTER TABLE \`product_category\` ADD \`parent_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product_category\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`stock_location\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`stock_location\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`supplier\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`supplier\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_17f434523d4566716f2b1c528a8\` FOREIGN KEY (\`parent_id\`) REFERENCES \`product_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_afd2c87bee70dd5557f48911e66\` FOREIGN KEY (\`department_id\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_afd2c87bee70dd5557f48911e66\``);
        await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_17f434523d4566716f2b1c528a8\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`supplier\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`supplier\` ADD \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`stock_location\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`stock_location\` ADD \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`product_category\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`product_category\` DROP COLUMN \`parent_id\``);
        await queryRunner.query(`ALTER TABLE \`product_category\` ADD \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`deleted_at\` \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`supplier\` CHANGE \`deleted_at\` \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`stock_location\` CHANGE \`deleted_at\` \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c1c6c6d6961f348b9e9f5f7d17\` ON \`user\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_9b3a7f6ce2f7262e8c2472aa90\` FOREIGN KEY (\`department_id\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
