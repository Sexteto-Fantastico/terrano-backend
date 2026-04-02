import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
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

export interface IPurchaseOrder {
    order_number: string;
    order_date: Date;
    status: PurchaseOrderStatus;
    supplier: Supplier;
    total: number;
    items: PurchaseOrderItem[];
    stock_movements?: StockMovement[];
    updated_by?: number;
}
@Entity("purchase_order")
export class PurchaseOrder extends BaseEntity implements IPurchaseOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, unique: true })
    order_number: string;

    @Column({ type: "date", name: "order_date" })
    order_date: Date;

    @Column({
        type: "enum",
        enum: PurchaseOrderStatus,
        default: PurchaseOrderStatus.DRAFT
    })
    status: PurchaseOrderStatus;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: "supplier_id" })
    supplier: Supplier;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total: number;

    @OneToMany(() => PurchaseOrderItem, (item) => item.purchase_order)
    items: PurchaseOrderItem[];

    @OneToMany(() => StockMovement, (movement) => movement.purchase_order)
    stock_movements: StockMovement[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "int", nullable: true })
    updated_by?: number;

    constructor(order: IPurchaseOrder) {
        super();
        Object.assign(this, order);
    }
}


