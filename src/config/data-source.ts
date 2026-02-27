import { DataSource } from "typeorm";
import { Supplier } from "../entities/supplier.entity";
import { Product } from "../entities/product.entity";
import { PurchaseOrder } from "../entities/purchase-order.entity";
import { PurchaseOrderItem } from "../entities/purchase-order-item.entity";
import { StockMovement } from "../entities/stock-movement.entity";
import { StockRequisition } from "../entities/stock-requisition.entity";
import { StockLocation } from "../entities/stock-location.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "terrano",
    synchronize: false,
    logging: true,
    entities: [
        Supplier,
        Product,
        PurchaseOrder,
        PurchaseOrderItem,
        StockMovement,
        StockRequisition,
        StockLocation,
    ],
    migrations: [],
    subscribers: [],
});
