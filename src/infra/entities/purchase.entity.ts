import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { PurchaseItem } from "./purchase-item.entity";
import { Supplier } from "./supplier.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";


export interface IPurchase extends ITerranoBaseEntity {
    nf_number?: string;
    nf_serie?: string;
    total: number;
    used_nf_xml_document: boolean;
    internal_notes?: string;
    estimated_delivery_date?: Date;
    purchase_date: Date;
    supplier: Supplier;
}

@Entity("purchase")
export class Purchase extends TerranoBaseEntity implements IPurchase {

    @Column({ type: "varchar", length: 50 , nullable: true})
    nf_number: string;

    @Column({ type: "varchar", length: 50 , nullable: true})
    nf_serie: string;

    @Column({ type: "real", default: 0 })
    total: number;

    @Column({ name: "used_nf_xml_document", type: "boolean", default: false })
    used_nf_xml_document: boolean = false;

    @Column({ name: "internal_notes", type: "text", nullable: true })
    internal_notes?: string;

    @Column({ type: "date", name: "purchase_date" })
    purchase_date: Date;

    @Column({ type: "date", name: "estimated_delivery_date", nullable: true })
    estimated_delivery_date?: Date;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: "supplier_id" })
    supplier: Supplier;
    
    @OneToMany(() => PurchaseItem, (item) => item.purchase)
    items: PurchaseItem[];

    constructor(order: IPurchase) {
        super(order);
        Object.assign(this, order);
    }
}


