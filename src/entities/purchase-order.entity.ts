import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { PurchaseOrderItem } from "./purchase-order-item.entity";
import { Supplier } from "./supplier.entity";
import { StockMovement } from "./stock-movement.entity";

export enum PurchaseOrderStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    CONFIRMED = "CONFIRMED",
    RECEIVED = "RECEIVED",
    CANCELLED = "CANCELLED",
}

@Entity("purchase_orders")
export class PurchaseOrder {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 50, unique: true })
    order_number!: string;

    @Column({ type: "date", name: "order_date" })
    order_date!: Date;

    @Column({
        type: "enum",
        enum: PurchaseOrderStatus,
        default: PurchaseOrderStatus.DRAFT
    })
    status!: PurchaseOrderStatus;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: "supplier_id" })
    supplier!: Supplier;

    @Column({ name: "supplier_id" })
    supplier_id!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total!: number;

    @OneToMany(() => PurchaseOrderItem, (item) => item.purchase_order)
    items!: PurchaseOrderItem[];

    @OneToMany(() => StockMovement, (movement) => movement.purchase_order)
    stock_movements!: StockMovement[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}