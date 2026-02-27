import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PurchaseOrder } from "./purchase-order.entity";

@Entity("supplier")
export class Supplier {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    corporate_name!: string;

    @Column({ type: "varchar", length: 255 })
    trade_name!: string;

    @Column({ type: "varchar", length: 14, unique: true })
    cnpj!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 20 })
    phone!: string;

    @Column({ type: "boolean", default: true })
    is_active!: boolean;

    @OneToMany(() => PurchaseOrder, (po) => po.supplier)
    purchase_orders!: PurchaseOrder[];
}
