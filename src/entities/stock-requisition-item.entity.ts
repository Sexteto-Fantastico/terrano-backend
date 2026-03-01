import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { StockRequisition } from "./stock-requisition.entity";

@Entity("stock_requisition_items")
export class StockRequisitionItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 200 })
    item!: string;

    @Column({ name: "declared_at", type: "date" })
    declared_at!: Date;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product!: Product;

    @Column({ name: "product_id" })
    product_id!: string;

    @Column({ type: "int" })
    quantity!: number;

    @Column({ type: "int", default: 0 })
    delivered!: number;

    @ManyToOne(() => StockRequisition, (req) => req.items)
    @JoinColumn({ name: "requisition_id" })
    requisition!: StockRequisition;

    @Column({ name: "requisition_id" })
    requisition_id!: string;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}