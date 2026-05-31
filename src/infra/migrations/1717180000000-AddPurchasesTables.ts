import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPurchasesTables1717180000000 implements MigrationInterface {
    name = 'AddPurchasesTables1717180000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "nf_number" varchar(50), "nf_serie" varchar(50), "total" real NOT NULL DEFAULT (0), "used_nf_xml_document" boolean NOT NULL DEFAULT (0), "internal_notes" text, "purchase_date" date NOT NULL, "estimated_delivery_date" date, "supplier_id" integer, CONSTRAINT "FK_purchase_supplier" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);

        await queryRunner.query(`CREATE TABLE "purchase_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "quantity" real NOT NULL, "unit_price" real NOT NULL, "total" real NOT NULL, "product_id" integer, "purchase_id" integer, CONSTRAINT "FK_purchase_item_product" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_purchase_item_purchase" FOREIGN KEY ("purchase_id") REFERENCES "purchase" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);

        await queryRunner.query(`CREATE TABLE "purchase_payment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by" integer, "updated_by" integer, "total" real NOT NULL, "payment_method" varchar NOT NULL, "purchase_id" integer, CONSTRAINT "FK_purchase_payment_purchase" FOREIGN KEY ("purchase_id") REFERENCES "purchase" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);

        await queryRunner.query(`CREATE INDEX "IDX_purchase_supplier" ON "purchase" ("supplier_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_purchase_item_product" ON "purchase_item" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_purchase_item_purchase" ON "purchase_item" ("purchase_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_purchase_payment_purchase" ON "purchase_payment" ("purchase_id") `);

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_purchase_payment_purchase"`);
        await queryRunner.query(`DROP INDEX "IDX_purchase_item_purchase"`);
        await queryRunner.query(`DROP INDEX "IDX_purchase_item_product"`);
        await queryRunner.query(`DROP INDEX "IDX_purchase_supplier"`);

        await queryRunner.query(`DROP TABLE "purchase_payment"`);
        await queryRunner.query(`DROP TABLE "purchase_item"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
    }

}
