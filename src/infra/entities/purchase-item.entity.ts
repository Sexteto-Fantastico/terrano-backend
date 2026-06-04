import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { Product } from "./product.entity";
import { Purchase } from "./purchase.entity";


export interface IPurchaseItem extends ITerranoBaseEntity {
    product: Product;
    quantity: number;
    unit_price: number;
    total: number;
    purchase: Purchase;
}

@Entity("purchase_item")
export class PurchaseItem extends TerranoBaseEntity implements IPurchaseItem {

    @Column({ type: "real" })
    quantity: number;

    @Column({ name: "unit_price", type: "real" })
    unit_price: number;

    @Column({ type: "real" })
    total: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;
    
    @ManyToOne(() => Purchase)
    @JoinColumn({ name: "purchase_id" })
    purchase: Purchase;
    
    constructor(order: IPurchaseItem) {
        super(order);
        Object.assign(this, order);
    }
}