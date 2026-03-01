import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { StockMovement } from "./stock-movement.entity";
import { StockLocationProduct } from "./stock-location-product.entity";
import { StockRequisitionItem } from "./stock-requisition-item.entity";
import { PurchaseOrderItem } from "./purchase-order-item.entity"; // ADICIONE ESTA LINHA

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 200 })
    name!: string;

    @Column({ length: 50, unique: true })
    code!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ name: "unit_price", type: "decimal", precision: 10, scale: 2, default: 0 })
    unit_price!: number;

    @Column({ name: "min_stock", type: "int", default: 0 })
    min_stock!: number;

    @Column({ name: "max_stock", type: "int", default: 0 })
    max_stock!: number;

    @Column({ name: "is_active", default: true })
    is_active!: boolean;

    @OneToMany(() => StockMovement, (movement) => movement.product)
    stock_movements!: StockMovement[];

    @OneToMany(() => StockLocationProduct, (slp) => slp.product)
    stock_location_products!: StockLocationProduct[];

    @OneToMany(() => StockRequisitionItem, (item) => item.product)
    requisition_items!: StockRequisitionItem[];

    @OneToMany(() => PurchaseOrderItem, (item) => item.product)
    purchase_order_items!: PurchaseOrderItem[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}