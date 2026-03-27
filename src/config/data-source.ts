import { DataSource } from "typeorm";
import { Supplier } from "../entities/supplier.entity";
import { Product } from "../entities/product.entity";
import { PurchaseOrder } from "../entities/purchase-order.entity";
import { PurchaseOrderItem } from "../entities/purchase-order-item.entity";
import { StockMovement } from "../entities/stock-movement.entity";
import { StockRequisition } from "../entities/stock-requisition.entity";
import { StockLocation } from "../entities/stock-location.entity";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Policy } from "../entities/policy.entity";
import { StockLocationProduct } from "../entities/stock-location-product.entity";
import { StockRequisitionItem } from "../entities/stock-requisition-item.entity";
import { Department } from "../entities/department.entity";
import { ProductCategory } from "../entities/product-category.entity";
import { StockBalance } from "../entities/stock-balance.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [
        Supplier,
        ProductCategory,
        Product,
        PurchaseOrder,
        PurchaseOrderItem,
        StockMovement,
        StockBalance,
        StockRequisition,
        StockLocation,
        Department,
        User,
        Role,
        Policy,
        StockLocationProduct,
        StockRequisitionItem,
    ],
    migrations: [],
    subscribers: [],
});