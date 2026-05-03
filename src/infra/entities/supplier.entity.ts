import { Entity, Column, OneToMany } from "typeorm";
import { PurchaseOrder } from "./purchase-order.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { OneToOne } from "typeorm";
import { Address } from "./address.entity";

export interface ISupplier extends ITerranoBaseEntity {
    corporate_name: string;
    trade_name: string;
    cnpj: string;
    email: string;
    phone: string;
    deleted_at?: Date;
}

@Entity("supplier")
export class Supplier extends TerranoBaseEntity implements ISupplier {

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

    @OneToMany(() => PurchaseOrder, (po) => po.supplier)
    purchase_orders: PurchaseOrder[];

    @OneToOne(() => Address, (address) => address.supplier)
    address: Address;

    constructor(supplier: ISupplier) {
        super(supplier);
        Object.assign(this, supplier);
    }
}