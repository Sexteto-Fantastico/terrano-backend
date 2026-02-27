import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
} from "typeorm";
import { Supplier } from "./supplier.entity";
import { PurchaseOrderItem } from "./purchase-order-item.entity";
import { StockMovement } from "./stock-movement.entity";

export enum PurchaseOrderStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    CANCELLED = "CANCELLED",
    DELIVERED = "DELIVERED",
}

@Entity("purchase_order")
export class PurchaseOrder {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Supplier, (supplier) => supplier.purchase_orders)
    supplier!: Supplier;

    @Column({ type: "enum", enum: PurchaseOrderStatus })
    status!: PurchaseOrderStatus;

    @CreateDateColumn()
    created_at!: Date;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    total_value!: number;

    @OneToMany(() => PurchaseOrderItem, (item) => item.purchase_order)
    items!: PurchaseOrderItem[];

    @OneToMany(() => StockMovement, (movement) => movement.purchase_order)
    stock_movements!: StockMovement[];
}
