import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { PurchaseOrder } from "./purchase-order.entity";
import { Product } from "./product.entity";

@Entity("purchase_order_item")
export class PurchaseOrderItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: "CASCADE" })
    purchase_order!: PurchaseOrder;

    @ManyToOne(() => Product, (product) => product.purchase_order_items)
    product!: Product;

    @Column({ type: "int" })
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    unit_price!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    subtotal!: number;
}
