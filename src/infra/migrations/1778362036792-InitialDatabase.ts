import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1778362036792 implements MigrationInterface {
    name = 'InitialDatabase1778362036792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`system_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`entity_name\` varchar(100) NOT NULL, \`entity_id\` int NULL, \`action\` varchar(50) NOT NULL, \`user_id\` int NULL, \`metadata\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`policy\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`resource\` varchar(50) NOT NULL, \`action\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_5ad65e4ff971649343992959bd\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(50) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_location_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`quantity\` int NOT NULL DEFAULT '0', \`product_id\` int NULL, \`location_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_location\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`purchase_order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`quantity\` int NOT NULL, \`unit_price\` decimal(10,2) NOT NULL, \`subtotal\` decimal(10,2) NOT NULL, \`purchaseOrderId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supplier\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`corporate_name\` varchar(255) NOT NULL, \`trade_name\` varchar(255) NOT NULL, \`cnpj\` varchar(14) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NOT NULL, UNIQUE INDEX \`IDX_6bcf219f3f47c8de1c0c82fd52\` (\`cnpj\`), UNIQUE INDEX \`IDX_c40cbff7400f06ae1c8d9f4233\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`purchase_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`order_number\` varchar(50) NOT NULL, \`order_date\` date NOT NULL, \`status\` enum ('DRAFT', 'SENT', 'CONFIRMED', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT', \`total\` decimal(10,2) NOT NULL DEFAULT '0.00', \`supplier_id\` int NULL, UNIQUE INDEX \`IDX_a932de191f1a55173e4b985c6e\` (\`order_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_movement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`movement_type\` enum ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT') NOT NULL, \`quantity\` int NOT NULL, \`unit_cost\` decimal(10,4) NOT NULL, \`productId\` int NULL, \`locationId\` int NULL, \`purchaseOrderId\` int NULL, \`requisitionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(200) NOT NULL, \`description\` text NULL, \`parent_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(100) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_aacf9270b7050ef2a350e9a913\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`measurement_unit\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(100) NOT NULL, \`symbol\` enum ('UN', 'KG', 'L', 'M', 'CX', 'PCT', 'OTHER') NOT NULL DEFAULT 'UN', \`type\` enum ('MASS', 'VOLUME', 'LENGTH', 'AREA', 'UNIT') NOT NULL DEFAULT 'UNIT', UNIQUE INDEX \`IDX_dbe5ce89c80b705b12b8c08d14\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(200) NOT NULL, \`code\` varchar(50) NOT NULL, \`description\` text NULL, \`category_id\` int NOT NULL, \`brand_id\` int NOT NULL, \`min_stock\` int NULL, \`max_stock\` int NULL, \`measurement_unit_id\` int NOT NULL, UNIQUE INDEX \`IDX_99c39b067cfa73c783f0fc49a6\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_requisition_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`item\` varchar(200) NOT NULL, \`declared_at\` date NOT NULL, \`quantity\` int NOT NULL, \`delivered\` int NOT NULL DEFAULT '0', \`product_id\` int NULL, \`requisition_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_requisition\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`company_name\` varchar(200) NOT NULL, \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING', \`declared_at\` date NOT NULL, \`total_value\` decimal(10,2) NOT NULL DEFAULT '0.00', \`department_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`department\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(100) NOT NULL, \`cost_center_code\` varchar(50) NOT NULL, \`manager_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`name\` varchar(100) NOT NULL, \`phone\` varchar(20) NULL, \`cpf\` varchar(14) NULL, \`email\` varchar(300) NOT NULL, \`username\` varchar(50) NOT NULL, \`password\` varchar(100) NOT NULL, \`requires_password_reset\` tinyint NOT NULL DEFAULT 0, \`password_reset_token\` varchar(255) NULL, \`password_reset_token_expires_at\` datetime NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`role_id\` int NULL, \`department_id\` int NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stock_balance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`quantity\` int NOT NULL DEFAULT '0', \`product_id\` int NULL, \`location_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`error_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` enum ('INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL, \`message\` varchar(1000) NOT NULL, \`status_code\` int NOT NULL, \`is_operational\` tinyint NOT NULL DEFAULT 1, \`stack\` text NULL, \`path\` varchar(500) NULL, \`method\` varchar(10) NULL, \`metadata\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_policies\` (\`role_id\` int NOT NULL, \`policy_id\` int NOT NULL, INDEX \`IDX_fb4e9cdfe54bbf9efd1bbd96d4\` (\`role_id\`), INDEX \`IDX_172c36e040c3f8233ce657d65a\` (\`policy_id\`), PRIMARY KEY (\`role_id\`, \`policy_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`stock_location_product\` ADD CONSTRAINT \`FK_29366848f998d97cacb7093e278\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_location_product\` ADD CONSTRAINT \`FK_169e30c0eeb9cd0531fefb55c27\` FOREIGN KEY (\`location_id\`) REFERENCES \`stock_location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_item\` ADD CONSTRAINT \`FK_13ef910b84865fed2a2799dea55\` FOREIGN KEY (\`purchaseOrderId\`) REFERENCES \`purchase_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_item\` ADD CONSTRAINT \`FK_3064ddc2f33fbc5b09f53cee561\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order\` ADD CONSTRAINT \`FK_3dacab5c4a43cecc0e48f5edb12\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`supplier\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_9e1078f3037faf8730f384bb422\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_820cba65200dc895440f1aa0233\` FOREIGN KEY (\`locationId\`) REFERENCES \`stock_location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_4074c87e32df6379a2fab412768\` FOREIGN KEY (\`purchaseOrderId\`) REFERENCES \`purchase_order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_b0e11166611d29e2de5c63da452\` FOREIGN KEY (\`requisitionId\`) REFERENCES \`stock_requisition\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_17f434523d4566716f2b1c528a8\` FOREIGN KEY (\`parent_id\`) REFERENCES \`product_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_0dce9bc93c2d2c399982d04bef1\` FOREIGN KEY (\`category_id\`) REFERENCES \`product_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_2eb5ce4324613b4b457c364f4a2\` FOREIGN KEY (\`brand_id\`) REFERENCES \`product_brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_81053b880793f88b6fca3b0010a\` FOREIGN KEY (\`measurement_unit_id\`) REFERENCES \`measurement_unit\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_requisition_item\` ADD CONSTRAINT \`FK_9a5d7f0b9c0cb42b760e3c5f9bf\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_requisition_item\` ADD CONSTRAINT \`FK_2cb7f7b233237ae4724a375fd49\` FOREIGN KEY (\`requisition_id\`) REFERENCES \`stock_requisition\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_requisition\` ADD CONSTRAINT \`FK_9725272c6f539f27aaa1481f381\` FOREIGN KEY (\`department_id\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`department\` ADD CONSTRAINT \`FK_4ca0fbc25538965a90575dc4a81\` FOREIGN KEY (\`manager_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_fb2e442d14add3cefbdf33c4561\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_afd2c87bee70dd5557f48911e66\` FOREIGN KEY (\`department_id\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_balance\` ADD CONSTRAINT \`FK_861d0a9bde76c84e6e301cf8abd\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stock_balance\` ADD CONSTRAINT \`FK_f8b2b588f7e7c8868a2756192d4\` FOREIGN KEY (\`location_id\`) REFERENCES \`stock_location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_policies\` ADD CONSTRAINT \`FK_fb4e9cdfe54bbf9efd1bbd96d43\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_policies\` ADD CONSTRAINT \`FK_172c36e040c3f8233ce657d65a7\` FOREIGN KEY (\`policy_id\`) REFERENCES \`policy\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_policies\` DROP FOREIGN KEY \`FK_172c36e040c3f8233ce657d65a7\``);
        await queryRunner.query(`ALTER TABLE \`role_policies\` DROP FOREIGN KEY \`FK_fb4e9cdfe54bbf9efd1bbd96d43\``);
        await queryRunner.query(`ALTER TABLE \`stock_balance\` DROP FOREIGN KEY \`FK_f8b2b588f7e7c8868a2756192d4\``);
        await queryRunner.query(`ALTER TABLE \`stock_balance\` DROP FOREIGN KEY \`FK_861d0a9bde76c84e6e301cf8abd\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_afd2c87bee70dd5557f48911e66\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_fb2e442d14add3cefbdf33c4561\``);
        await queryRunner.query(`ALTER TABLE \`department\` DROP FOREIGN KEY \`FK_4ca0fbc25538965a90575dc4a81\``);
        await queryRunner.query(`ALTER TABLE \`stock_requisition\` DROP FOREIGN KEY \`FK_9725272c6f539f27aaa1481f381\``);
        await queryRunner.query(`ALTER TABLE \`stock_requisition_item\` DROP FOREIGN KEY \`FK_2cb7f7b233237ae4724a375fd49\``);
        await queryRunner.query(`ALTER TABLE \`stock_requisition_item\` DROP FOREIGN KEY \`FK_9a5d7f0b9c0cb42b760e3c5f9bf\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_81053b880793f88b6fca3b0010a\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_2eb5ce4324613b4b457c364f4a2\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_0dce9bc93c2d2c399982d04bef1\``);
        await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_17f434523d4566716f2b1c528a8\``);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_b0e11166611d29e2de5c63da452\``);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_4074c87e32df6379a2fab412768\``);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_820cba65200dc895440f1aa0233\``);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_9e1078f3037faf8730f384bb422\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order\` DROP FOREIGN KEY \`FK_3dacab5c4a43cecc0e48f5edb12\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_item\` DROP FOREIGN KEY \`FK_3064ddc2f33fbc5b09f53cee561\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_item\` DROP FOREIGN KEY \`FK_13ef910b84865fed2a2799dea55\``);
        await queryRunner.query(`ALTER TABLE \`stock_location_product\` DROP FOREIGN KEY \`FK_169e30c0eeb9cd0531fefb55c27\``);
        await queryRunner.query(`ALTER TABLE \`stock_location_product\` DROP FOREIGN KEY \`FK_29366848f998d97cacb7093e278\``);
        await queryRunner.query(`DROP INDEX \`IDX_172c36e040c3f8233ce657d65a\` ON \`role_policies\``);
        await queryRunner.query(`DROP INDEX \`IDX_fb4e9cdfe54bbf9efd1bbd96d4\` ON \`role_policies\``);
        await queryRunner.query(`DROP TABLE \`role_policies\``);
        await queryRunner.query(`DROP TABLE \`error_log\``);
        await queryRunner.query(`DROP TABLE \`stock_balance\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`department\``);
        await queryRunner.query(`DROP TABLE \`stock_requisition\``);
        await queryRunner.query(`DROP TABLE \`stock_requisition_item\``);
        await queryRunner.query(`DROP INDEX \`IDX_99c39b067cfa73c783f0fc49a6\` ON \`product\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP INDEX \`IDX_dbe5ce89c80b705b12b8c08d14\` ON \`measurement_unit\``);
        await queryRunner.query(`DROP TABLE \`measurement_unit\``);
        await queryRunner.query(`DROP INDEX \`IDX_aacf9270b7050ef2a350e9a913\` ON \`product_brand\``);
        await queryRunner.query(`DROP TABLE \`product_brand\``);
        await queryRunner.query(`DROP TABLE \`product_category\``);
        await queryRunner.query(`DROP TABLE \`stock_movement\``);
        await queryRunner.query(`DROP INDEX \`IDX_a932de191f1a55173e4b985c6e\` ON \`purchase_order\``);
        await queryRunner.query(`DROP TABLE \`purchase_order\``);
        await queryRunner.query(`DROP INDEX \`IDX_c40cbff7400f06ae1c8d9f4233\` ON \`supplier\``);
        await queryRunner.query(`DROP INDEX \`IDX_6bcf219f3f47c8de1c0c82fd52\` ON \`supplier\``);
        await queryRunner.query(`DROP TABLE \`supplier\``);
        await queryRunner.query(`DROP TABLE \`purchase_order_item\``);
        await queryRunner.query(`DROP TABLE \`stock_location\``);
        await queryRunner.query(`DROP TABLE \`stock_location_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP INDEX \`IDX_5ad65e4ff971649343992959bd\` ON \`policy\``);
        await queryRunner.query(`DROP TABLE \`policy\``);
        await queryRunner.query(`DROP TABLE \`system_log\``);
    }

}
