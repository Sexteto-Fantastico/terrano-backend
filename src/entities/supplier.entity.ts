import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { PurchaseOrder } from "./purchase-order.entity";

export interface ISupplier {
    corporate_name: string;
    trade_name: string;
    cnpj: string;
    email: string;
    phone: string;
    is_active: boolean;
}
@Entity("supplier")
export class Supplier extends BaseEntity implements ISupplier {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    corporate_name: string;

    @Column({ type: "varchar", length: 255 })
    trade_name: string;

    @Column({ type: "varchar", length: 14, unique: true })
    cnpj: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 20 })
    phone: string;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @OneToMany(() => PurchaseOrder, (po) => po.supplier)
    purchase_orders: PurchaseOrder[];

    constructor(supplier: ISupplier) {
        super();
        Object.assign(this, supplier);
    }
}
