import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PurchaseOrderItem } from "./purchase-order-item.entity";
import { StockMovement } from "./stock-movement.entity";

@Entity("product")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToMany(() => PurchaseOrderItem, (item) => item.product)
    purchase_order_items!: PurchaseOrderItem[];

    @OneToMany(() => StockMovement, (movement) => movement.product)
    stock_movements!: StockMovement[];
}
