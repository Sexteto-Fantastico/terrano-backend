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
import { StockLocation } from "./stock-location.entity";

export interface IStockBalance {
    product: Product;
    location: StockLocation;
    quantity: number;
    updated_by?: number;
}

@Entity("stock_location_product")
export class StockLocationProduct extends BaseEntity implements IStockBalance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => StockLocation)
    @JoinColumn({ name: "location_id" })
    location: StockLocation;

    @Column({ type: "int", default: 0 })
    quantity: number;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "int", nullable: true })
    updated_by?: number;

    constructor(balance: IStockBalance) {
        super();
        Object.assign(this, balance);
    }
}


