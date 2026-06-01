import { AppDataSource } from "./data-source";
import { createAdminSeed } from "../seeds/admin.seed";
import { createRoleSeed } from "../seeds/role.seed";
import { createPolicySeed } from "../seeds/policy.seed";
import { createProductCategorySeed } from "../seeds/product-category.seed";
import { createProductBrandSeed } from "../seeds/product-brand.seed";
import { createMeasurementUnitSeed } from "../seeds/measurement-unit.seed";
import { createStockLocationSeed } from "../seeds/stock-location.seed";
import { createSupplierSeed } from "../seeds/supplier.seed";
import { createDepartmentSeed } from "../seeds/department.seed";
import { createUserSeed } from "../seeds/user.seed";
import { createProductSeed } from "../seeds/product.seed";
import { createStockLocationProductSeed } from "../seeds/stock-location-product.seed";
import { createStockBalanceSeed } from "../seeds/stock-balance.seed";
import { createPurchaseSeed } from "../seeds/purchase.seed";
import { createPurchaseItemSeed } from "../seeds/purchase-item.seed";
import { createPurchasePaymentSeed } from "../seeds/purchase-payment.seed";
import { createStockRequisitionSeed } from "../seeds/stock-requisition.seed";
import { createSystemLogSeed } from "../seeds/system-log.seed";
import { createErrorLogSeed } from "../seeds/error-log.seed";
import { createStockRequisitionItemSeed } from "../seeds/stock-requisiton-item.seed";
import { createMovementSeed } from "../seeds/movement.seed";

export async function migrateDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();

        console.log("Database connected successfully");
        console.log("Running migrations...");

        await AppDataSource.runMigrations();

        console.log("Migrations executed successfully");
        
        await createRoleSeed();
        await createAdminSeed();
        await createRoleSeed()
        await createAdminSeed();
        await createPolicySeed()
        await createProductCategorySeed()
        await createProductBrandSeed()
        await createMeasurementUnitSeed()
        await createStockLocationSeed()
        await createSupplierSeed()
        await createDepartmentSeed()
        await createAdminSeed()
        await createUserSeed()
        await createProductSeed()
        await createStockLocationProductSeed()
        await createStockBalanceSeed()
        await createPurchaseSeed()
        await createPurchaseItemSeed()
        await createPurchasePaymentSeed()
        await createStockRequisitionSeed()
        await createStockRequisitionItemSeed()
        await createMovementSeed();
        await createSystemLogSeed()
        await createErrorLogSeed()

    } catch (err) {
        console.error("Migration error:", err);
        throw err;
    }
}