import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { StockLocation } from "./stock-location.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IStockBalance extends ITerranoBaseEntity {
    product: Product;
    location: StockLocation;
    quantity: number;
    updated_by?: number;
}

@Entity("stock_balance")
export class StockBalance extends TerranoBaseEntity implements IStockBalance {

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => StockLocation)
    @JoinColumn({ name: "location_id" })
    location: StockLocation;

    @Column({ type: "int", default: 0 })
    quantity: number;
    
    constructor(balance: IStockBalance) {
        super(balance);
        Object.assign(this, balance);
    }
}


