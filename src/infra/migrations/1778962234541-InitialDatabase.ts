import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1778962234541 implements MigrationInterface {
  name = "InitialDatabase1778962234541";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "system_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "entity_name" varchar(100) NOT NULL, "entity_id" integer, "action" varchar(50) NOT NULL, "user_id" integer, "metadata" text)`
    );
    await queryRunner.query(
      `CREATE TABLE "policy" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "description" text, "resource" varchar(50) NOT NULL, "action" varchar(50) NOT NULL, CONSTRAINT "UQ_5ad65e4ff971649343992959bd0" UNIQUE ("name"))`
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(50) NOT NULL, "description" text, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"))`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_location_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL DEFAULT (0), "product_id" integer, "location_id" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "purchase_order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL, "unit_price" real NOT NULL, "subtotal" real NOT NULL, "purchaseOrderId" integer, "productId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "order_number" varchar(50) NOT NULL, "order_date" date NOT NULL, "status" varchar CHECK( "status" IN ('DRAFT','SENT','CONFIRMED','RECEIVED','CANCELLED') ) NOT NULL DEFAULT ('DRAFT'), "total" real NOT NULL DEFAULT (0), "supplier_id" integer, CONSTRAINT "UQ_a932de191f1a55173e4b985c6ea" UNIQUE ("order_number"))`
    );
    await queryRunner.query(
      `CREATE TABLE "supplier" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "corporate_name" varchar(255) NOT NULL, "trade_name" varchar(255) NOT NULL, "cnpj" varchar(14) NOT NULL, "email" varchar(255) NOT NULL, "phone" varchar(20) NOT NULL, CONSTRAINT "UQ_6bcf219f3f47c8de1c0c82fd523" UNIQUE ("cnpj"), CONSTRAINT "UQ_c40cbff7400f06ae1c8d9f42333" UNIQUE ("email"))`
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "street" varchar(255) NOT NULL, "number" varchar(20) NOT NULL, "neighborhood" varchar(100) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "country" varchar(100) NOT NULL, "complement" varchar(255), "supplier_id" integer, "stock_location_id" integer, CONSTRAINT "REL_a0e0c4cd24caf22e226a502c75" UNIQUE ("supplier_id"), CONSTRAINT "REL_37e547074eba82892be161e83b" UNIQUE ("stock_location_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "description" text)`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_movement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "movement_type" varchar CHECK( "movement_type" IN ('IN','OUT','TRANSFER','ADJUSTMENT') ) NOT NULL, "quantity" integer NOT NULL, "unit_cost" real NOT NULL, "productId" integer, "locationId" integer, "purchaseOrderId" integer, "requisitionId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "product_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(200) NOT NULL, "description" text, "parent_id" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "product_brand" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_aacf9270b7050ef2a350e9a913a" UNIQUE ("name"))`
    );
    await queryRunner.query(
      `CREATE TABLE "measurement_unit" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "symbol" varchar CHECK( "symbol" IN ('UN','KG','L','M','CX','PCT','OTHER') ) NOT NULL DEFAULT ('UN'), "type" varchar CHECK( "type" IN ('MASS','VOLUME','LENGTH','AREA','UNIT') ) NOT NULL DEFAULT ('UNIT'), CONSTRAINT "UQ_dbe5ce89c80b705b12b8c08d146" UNIQUE ("name"))`
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(200) NOT NULL, "code" varchar(50) NOT NULL, "description" text, "category_id" integer NOT NULL, "brand_id" integer NOT NULL, "min_stock" integer, "max_stock" integer, "measurement_unit_id" integer NOT NULL, CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code"))`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_requisition_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "item" varchar(200) NOT NULL, "declared_at" date NOT NULL, "quantity" integer NOT NULL, "delivered" integer NOT NULL DEFAULT (0), "product_id" integer, "requisition_id" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_requisition" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "company_name" varchar(200) NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','APPROVED','REJECTED','COMPLETED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "declared_at" date NOT NULL, "total_value" real NOT NULL DEFAULT (0), "department_id" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "department" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "cost_center_code" varchar(50) NOT NULL, "manager_id" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "phone" varchar(20), "cpf" varchar(14), "email" varchar(300) NOT NULL, "username" varchar(50) NOT NULL, "password" varchar(100) NOT NULL, "requires_password_reset" boolean NOT NULL DEFAULT (0), "password_reset_token" varchar(255), "password_reset_token_expires_at" datetime, "is_active" boolean NOT NULL DEFAULT (1), "role_id" integer, "department_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_balance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL DEFAULT (0), "product_id" integer, "location_id" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "error_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "level" varchar CHECK( "level" IN ('INFO','WARN','ERROR','FATAL') ) NOT NULL, "message" varchar(1000) NOT NULL, "status_code" integer NOT NULL, "is_operational" boolean NOT NULL DEFAULT (1), "stack" text, "path" varchar(500), "method" varchar(10), "metadata" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`
    );
    await queryRunner.query(
      `CREATE TABLE "role_policies" ("role_id" integer NOT NULL, "policy_id" integer NOT NULL, PRIMARY KEY ("role_id", "policy_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb4e9cdfe54bbf9efd1bbd96d4" ON "role_policies" ("role_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_172c36e040c3f8233ce657d65a" ON "role_policies" ("policy_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_location_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL DEFAULT (0), "product_id" integer, "location_id" integer, CONSTRAINT "FK_29366848f998d97cacb7093e278" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_169e30c0eeb9cd0531fefb55c27" FOREIGN KEY ("location_id") REFERENCES "stock_location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_location_product"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id" FROM "stock_location_product"`
    );
    await queryRunner.query(`DROP TABLE "stock_location_product"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_location_product" RENAME TO "stock_location_product"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_purchase_order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL, "unit_price" real NOT NULL, "subtotal" real NOT NULL, "purchaseOrderId" integer, "productId" integer, CONSTRAINT "FK_13ef910b84865fed2a2799dea55" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_3064ddc2f33fbc5b09f53cee561" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_purchase_order_item"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "unit_price", "subtotal", "purchaseOrderId", "productId") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "unit_price", "subtotal", "purchaseOrderId", "productId" FROM "purchase_order_item"`
    );
    await queryRunner.query(`DROP TABLE "purchase_order_item"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_purchase_order_item" RENAME TO "purchase_order_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "order_number" varchar(50) NOT NULL, "order_date" date NOT NULL, "status" varchar CHECK( "status" IN ('DRAFT','SENT','CONFIRMED','RECEIVED','CANCELLED') ) NOT NULL DEFAULT ('DRAFT'), "total" real NOT NULL DEFAULT (0), "supplier_id" integer, CONSTRAINT "UQ_a932de191f1a55173e4b985c6ea" UNIQUE ("order_number"), CONSTRAINT "FK_3dacab5c4a43cecc0e48f5edb12" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_purchase_order"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "order_number", "order_date", "status", "total", "supplier_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "order_number", "order_date", "status", "total", "supplier_id" FROM "purchase_order"`
    );
    await queryRunner.query(`DROP TABLE "purchase_order"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_purchase_order" RENAME TO "purchase_order"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "street" varchar(255) NOT NULL, "number" varchar(20) NOT NULL, "neighborhood" varchar(100) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "country" varchar(100) NOT NULL, "complement" varchar(255), "supplier_id" integer, "stock_location_id" integer, CONSTRAINT "REL_a0e0c4cd24caf22e226a502c75" UNIQUE ("supplier_id"), CONSTRAINT "REL_37e547074eba82892be161e83b" UNIQUE ("stock_location_id"), CONSTRAINT "FK_a0e0c4cd24caf22e226a502c75b" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_37e547074eba82892be161e83b5" FOREIGN KEY ("stock_location_id") REFERENCES "stock_location" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_address"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "street", "number", "neighborhood", "city", "state", "country", "complement", "supplier_id", "stock_location_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "street", "number", "neighborhood", "city", "state", "country", "complement", "supplier_id", "stock_location_id" FROM "address"`
    );
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_address" RENAME TO "address"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_movement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "movement_type" varchar CHECK( "movement_type" IN ('IN','OUT','TRANSFER','ADJUSTMENT') ) NOT NULL, "quantity" integer NOT NULL, "unit_cost" real NOT NULL, "productId" integer, "locationId" integer, "purchaseOrderId" integer, "requisitionId" integer, CONSTRAINT "FK_9e1078f3037faf8730f384bb422" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_820cba65200dc895440f1aa0233" FOREIGN KEY ("locationId") REFERENCES "stock_location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4074c87e32df6379a2fab412768" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b0e11166611d29e2de5c63da452" FOREIGN KEY ("requisitionId") REFERENCES "stock_requisition" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_movement"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "movement_type", "quantity", "unit_cost", "productId", "locationId", "purchaseOrderId", "requisitionId") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "movement_type", "quantity", "unit_cost", "productId", "locationId", "purchaseOrderId", "requisitionId" FROM "stock_movement"`
    );
    await queryRunner.query(`DROP TABLE "stock_movement"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_movement" RENAME TO "stock_movement"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_product_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(200) NOT NULL, "description" text, "parent_id" integer, CONSTRAINT "FK_17f434523d4566716f2b1c528a8" FOREIGN KEY ("parent_id") REFERENCES "product_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_product_category"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "description", "parent_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "description", "parent_id" FROM "product_category"`
    );
    await queryRunner.query(`DROP TABLE "product_category"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_product_category" RENAME TO "product_category"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(200) NOT NULL, "code" varchar(50) NOT NULL, "description" text, "category_id" integer NOT NULL, "brand_id" integer NOT NULL, "min_stock" integer, "max_stock" integer, "measurement_unit_id" integer NOT NULL, CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code"), CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "product_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2" FOREIGN KEY ("brand_id") REFERENCES "product_brand" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_81053b880793f88b6fca3b0010a" FOREIGN KEY ("measurement_unit_id") REFERENCES "measurement_unit" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_product"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "code", "description", "category_id", "brand_id", "min_stock", "max_stock", "measurement_unit_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "code", "description", "category_id", "brand_id", "min_stock", "max_stock", "measurement_unit_id" FROM "product"`
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_product" RENAME TO "product"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_requisition_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "item" varchar(200) NOT NULL, "declared_at" date NOT NULL, "quantity" integer NOT NULL, "delivered" integer NOT NULL DEFAULT (0), "product_id" integer, "requisition_id" integer, CONSTRAINT "FK_9a5d7f0b9c0cb42b760e3c5f9bf" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2cb7f7b233237ae4724a375fd49" FOREIGN KEY ("requisition_id") REFERENCES "stock_requisition" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_requisition_item"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "item", "declared_at", "quantity", "delivered", "product_id", "requisition_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "item", "declared_at", "quantity", "delivered", "product_id", "requisition_id" FROM "stock_requisition_item"`
    );
    await queryRunner.query(`DROP TABLE "stock_requisition_item"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_requisition_item" RENAME TO "stock_requisition_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_requisition" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "company_name" varchar(200) NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','APPROVED','REJECTED','COMPLETED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "declared_at" date NOT NULL, "total_value" real NOT NULL DEFAULT (0), "department_id" integer, CONSTRAINT "FK_9725272c6f539f27aaa1481f381" FOREIGN KEY ("department_id") REFERENCES "department" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_requisition"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "company_name", "status", "declared_at", "total_value", "department_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "company_name", "status", "declared_at", "total_value", "department_id" FROM "stock_requisition"`
    );
    await queryRunner.query(`DROP TABLE "stock_requisition"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_requisition" RENAME TO "stock_requisition"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_department" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "cost_center_code" varchar(50) NOT NULL, "manager_id" integer, CONSTRAINT "FK_4ca0fbc25538965a90575dc4a81" FOREIGN KEY ("manager_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_department"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "cost_center_code", "manager_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "cost_center_code", "manager_id" FROM "department"`
    );
    await queryRunner.query(`DROP TABLE "department"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_department" RENAME TO "department"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "phone" varchar(20), "cpf" varchar(14), "email" varchar(300) NOT NULL, "username" varchar(50) NOT NULL, "password" varchar(100) NOT NULL, "requires_password_reset" boolean NOT NULL DEFAULT (0), "password_reset_token" varchar(255), "password_reset_token_expires_at" datetime, "is_active" boolean NOT NULL DEFAULT (1), "role_id" integer, "department_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_afd2c87bee70dd5557f48911e66" FOREIGN KEY ("department_id") REFERENCES "department" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "phone", "cpf", "email", "username", "password", "requires_password_reset", "password_reset_token", "password_reset_token_expires_at", "is_active", "role_id", "department_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "phone", "cpf", "email", "username", "password", "requires_password_reset", "password_reset_token", "password_reset_token_expires_at", "is_active", "role_id", "department_id" FROM "user"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_balance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL DEFAULT (0), "product_id" integer, "location_id" integer, CONSTRAINT "FK_861d0a9bde76c84e6e301cf8abd" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f8b2b588f7e7c8868a2756192d4" FOREIGN KEY ("location_id") REFERENCES "stock_location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_balance"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id" FROM "stock_balance"`
    );
    await queryRunner.query(`DROP TABLE "stock_balance"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_balance" RENAME TO "stock_balance"`
    );
    await queryRunner.query(`DROP INDEX "IDX_fb4e9cdfe54bbf9efd1bbd96d4"`);
    await queryRunner.query(`DROP INDEX "IDX_172c36e040c3f8233ce657d65a"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_role_policies" ("role_id" integer NOT NULL, "policy_id" integer NOT NULL, CONSTRAINT "FK_fb4e9cdfe54bbf9efd1bbd96d43" FOREIGN KEY ("role_id") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_172c36e040c3f8233ce657d65a7" FOREIGN KEY ("policy_id") REFERENCES "policy" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("role_id", "policy_id"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_role_policies"("role_id", "policy_id") SELECT "role_id", "policy_id" FROM "role_policies"`
    );
    await queryRunner.query(`DROP TABLE "role_policies"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_role_policies" RENAME TO "role_policies"`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb4e9cdfe54bbf9efd1bbd96d4" ON "role_policies" ("role_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_172c36e040c3f8233ce657d65a" ON "role_policies" ("policy_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_172c36e040c3f8233ce657d65a"`);
    await queryRunner.query(`DROP INDEX "IDX_fb4e9cdfe54bbf9efd1bbd96d4"`);
    await queryRunner.query(
      `ALTER TABLE "role_policies" RENAME TO "temporary_role_policies"`
    );
    await queryRunner.query(
      `CREATE TABLE "role_policies" ("role_id" integer NOT NULL, "policy_id" integer NOT NULL, PRIMARY KEY ("role_id", "policy_id"))`
    );
    await queryRunner.query(
      `INSERT INTO "role_policies"("role_id", "policy_id") SELECT "role_id", "policy_id" FROM "temporary_role_policies"`
    );
    await queryRunner.query(`DROP TABLE "temporary_role_policies"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_172c36e040c3f8233ce657d65a" ON "role_policies" ("policy_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb4e9cdfe54bbf9efd1bbd96d4" ON "role_policies" ("role_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "stock_balance" RENAME TO "temporary_stock_balance"`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_balance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL DEFAULT (0), "product_id" integer, "location_id" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "stock_balance"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id" FROM "temporary_stock_balance"`
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_balance"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "phone" varchar(20), "cpf" varchar(14), "email" varchar(300) NOT NULL, "username" varchar(50) NOT NULL, "password" varchar(100) NOT NULL, "requires_password_reset" boolean NOT NULL DEFAULT (0), "password_reset_token" varchar(255), "password_reset_token_expires_at" datetime, "is_active" boolean NOT NULL DEFAULT (1), "role_id" integer, "department_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "phone", "cpf", "email", "username", "password", "requires_password_reset", "password_reset_token", "password_reset_token_expires_at", "is_active", "role_id", "department_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "phone", "cpf", "email", "username", "password", "requires_password_reset", "password_reset_token", "password_reset_token_expires_at", "is_active", "role_id", "department_id" FROM "temporary_user"`
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(
      `ALTER TABLE "department" RENAME TO "temporary_department"`
    );
    await queryRunner.query(
      `CREATE TABLE "department" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(100) NOT NULL, "cost_center_code" varchar(50) NOT NULL, "manager_id" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "department"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "cost_center_code", "manager_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "cost_center_code", "manager_id" FROM "temporary_department"`
    );
    await queryRunner.query(`DROP TABLE "temporary_department"`);
    await queryRunner.query(
      `ALTER TABLE "stock_requisition" RENAME TO "temporary_stock_requisition"`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_requisition" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "company_name" varchar(200) NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','APPROVED','REJECTED','COMPLETED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "declared_at" date NOT NULL, "total_value" real NOT NULL DEFAULT (0), "department_id" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "stock_requisition"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "company_name", "status", "declared_at", "total_value", "department_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "company_name", "status", "declared_at", "total_value", "department_id" FROM "temporary_stock_requisition"`
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_requisition"`);
    await queryRunner.query(
      `ALTER TABLE "stock_requisition_item" RENAME TO "temporary_stock_requisition_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_requisition_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "item" varchar(200) NOT NULL, "declared_at" date NOT NULL, "quantity" integer NOT NULL, "delivered" integer NOT NULL DEFAULT (0), "product_id" integer, "requisition_id" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "stock_requisition_item"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "item", "declared_at", "quantity", "delivered", "product_id", "requisition_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "item", "declared_at", "quantity", "delivered", "product_id", "requisition_id" FROM "temporary_stock_requisition_item"`
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_requisition_item"`);
    await queryRunner.query(
      `ALTER TABLE "product" RENAME TO "temporary_product"`
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(200) NOT NULL, "code" varchar(50) NOT NULL, "description" text, "category_id" integer NOT NULL, "brand_id" integer NOT NULL, "min_stock" integer, "max_stock" integer, "measurement_unit_id" integer NOT NULL, CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code"))`
    );
    await queryRunner.query(
      `INSERT INTO "product"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "code", "description", "category_id", "brand_id", "min_stock", "max_stock", "measurement_unit_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "code", "description", "category_id", "brand_id", "min_stock", "max_stock", "measurement_unit_id" FROM "temporary_product"`
    );
    await queryRunner.query(`DROP TABLE "temporary_product"`);
    await queryRunner.query(
      `ALTER TABLE "product_category" RENAME TO "temporary_product_category"`
    );
    await queryRunner.query(
      `CREATE TABLE "product_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "name" varchar(200) NOT NULL, "description" text, "parent_id" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "product_category"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "description", "parent_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "name", "description", "parent_id" FROM "temporary_product_category"`
    );
    await queryRunner.query(`DROP TABLE "temporary_product_category"`);
    await queryRunner.query(
      `ALTER TABLE "stock_movement" RENAME TO "temporary_stock_movement"`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_movement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "movement_type" varchar CHECK( "movement_type" IN ('IN','OUT','TRANSFER','ADJUSTMENT') ) NOT NULL, "quantity" integer NOT NULL, "unit_cost" real NOT NULL, "productId" integer, "locationId" integer, "purchaseOrderId" integer, "requisitionId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "stock_movement"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "movement_type", "quantity", "unit_cost", "productId", "locationId", "purchaseOrderId", "requisitionId") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "movement_type", "quantity", "unit_cost", "productId", "locationId", "purchaseOrderId", "requisitionId" FROM "temporary_stock_movement"`
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_movement"`);
    await queryRunner.query(
      `ALTER TABLE "address" RENAME TO "temporary_address"`
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "street" varchar(255) NOT NULL, "number" varchar(20) NOT NULL, "neighborhood" varchar(100) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "country" varchar(100) NOT NULL, "complement" varchar(255), "supplier_id" integer, "stock_location_id" integer, CONSTRAINT "REL_a0e0c4cd24caf22e226a502c75" UNIQUE ("supplier_id"), CONSTRAINT "REL_37e547074eba82892be161e83b" UNIQUE ("stock_location_id"))`
    );
    await queryRunner.query(
      `INSERT INTO "address"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "street", "number", "neighborhood", "city", "state", "country", "complement", "supplier_id", "stock_location_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "street", "number", "neighborhood", "city", "state", "country", "complement", "supplier_id", "stock_location_id" FROM "temporary_address"`
    );
    await queryRunner.query(`DROP TABLE "temporary_address"`);
    await queryRunner.query(
      `ALTER TABLE "purchase_order" RENAME TO "temporary_purchase_order"`
    );
    await queryRunner.query(
      `CREATE TABLE "purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "order_number" varchar(50) NOT NULL, "order_date" date NOT NULL, "status" varchar CHECK( "status" IN ('DRAFT','SENT','CONFIRMED','RECEIVED','CANCELLED') ) NOT NULL DEFAULT ('DRAFT'), "total" real NOT NULL DEFAULT (0), "supplier_id" integer, CONSTRAINT "UQ_a932de191f1a55173e4b985c6ea" UNIQUE ("order_number"))`
    );
    await queryRunner.query(
      `INSERT INTO "purchase_order"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "order_number", "order_date", "status", "total", "supplier_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "order_number", "order_date", "status", "total", "supplier_id" FROM "temporary_purchase_order"`
    );
    await queryRunner.query(`DROP TABLE "temporary_purchase_order"`);
    await queryRunner.query(
      `ALTER TABLE "purchase_order_item" RENAME TO "temporary_purchase_order_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "purchase_order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL, "unit_price" real NOT NULL, "subtotal" real NOT NULL, "purchaseOrderId" integer, "productId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "purchase_order_item"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "unit_price", "subtotal", "purchaseOrderId", "productId") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "unit_price", "subtotal", "purchaseOrderId", "productId" FROM "temporary_purchase_order_item"`
    );
    await queryRunner.query(`DROP TABLE "temporary_purchase_order_item"`);
    await queryRunner.query(
      `ALTER TABLE "stock_location_product" RENAME TO "temporary_stock_location_product"`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_location_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL DEFAULT (0), "product_id" integer, "location_id" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "stock_location_product"("id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id") SELECT "id", "updated_at", "created_at", "deleted_at", "created_by", "updated_by", "quantity", "product_id", "location_id" FROM "temporary_stock_location_product"`
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_location_product"`);
    await queryRunner.query(`DROP INDEX "IDX_172c36e040c3f8233ce657d65a"`);
    await queryRunner.query(`DROP INDEX "IDX_fb4e9cdfe54bbf9efd1bbd96d4"`);
    await queryRunner.query(`DROP TABLE "role_policies"`);
    await queryRunner.query(`DROP TABLE "error_log"`);
    await queryRunner.query(`DROP TABLE "stock_balance"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "department"`);
    await queryRunner.query(`DROP TABLE "stock_requisition"`);
    await queryRunner.query(`DROP TABLE "stock_requisition_item"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "measurement_unit"`);
    await queryRunner.query(`DROP TABLE "product_brand"`);
    await queryRunner.query(`DROP TABLE "product_category"`);
    await queryRunner.query(`DROP TABLE "stock_movement"`);
    await queryRunner.query(`DROP TABLE "stock_location"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "supplier"`);
    await queryRunner.query(`DROP TABLE "purchase_order"`);
    await queryRunner.query(`DROP TABLE "purchase_order_item"`);
    await queryRunner.query(`DROP TABLE "stock_location_product"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "policy"`);
    await queryRunner.query(`DROP TABLE "system_log"`);
  }
}
