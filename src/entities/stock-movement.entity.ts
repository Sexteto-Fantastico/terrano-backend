import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { StockLocation } from "./stock-location.entity";
import { PurchaseOrder } from "./purchase-order.entity";
import { StockRequisition } from "./stock-requisition.entity";

export enum MovementType {
    IN = "IN",
    OUT = "OUT",
    TRANSFER = "TRANSFER",
    ADJUSTMENT = "ADJUSTMENT",
}

@Entity("stock_movement")
export class StockMovement {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Product, (product) => product.stock_movements)
    product!: Product;

    @ManyToOne(() => StockLocation, (location) => location.stock_movements)
    location!: StockLocation;

    @Column({ type: "enum", enum: MovementType })
    movement_type!: MovementType;

    @ManyToOne(() => PurchaseOrder, (po) => po.stock_movements, { nullable: true })
    purchase_order!: PurchaseOrder | null;

    @ManyToOne(() => StockRequisition, (req) => req.stock_movements, { nullable: true })
    requisition!: StockRequisition | null;

    @Column({ type: "int" })
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 4 })
    unit_cost!: number;

    @CreateDateColumn()
    created_at!: Date;
}
