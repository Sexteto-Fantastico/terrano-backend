import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";
import { Product } from "./product.entity";
import { StockRequisition } from "./stock-requisition.entity";

export interface IStockRequisitionItem {
    item: string;
    declared_at: Date;
    product: Product;
    quantity: number;
    delivered: number;
    requisition: StockRequisition;
    updated_by: string;
}
@Entity("stock_requisition_item")
export class StockRequisitionItem extends BaseEntity implements IStockRequisitionItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 200 })
    item: string;

    @Column({ name: "declared_at", type: "date" })
    declared_at: Date;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "int", default: 0 })
    delivered: number;

    @ManyToOne(() => StockRequisition, (req) => req.items)
    @JoinColumn({ name: "requisition_id" })
    requisition: StockRequisition;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by: string;

    constructor(item: IStockRequisitionItem) {
        super();
        Object.assign(this, item);
    }
}