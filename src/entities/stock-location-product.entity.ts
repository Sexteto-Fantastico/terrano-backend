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
import { StockLocation } from "./stock-location.entity";

@Entity("stock_location_products")
export class StockLocationProduct {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product!: Product;

    @Column({ name: "product_id" })
    product_id!: string;

    @ManyToOne(() => StockLocation)
    @JoinColumn({ name: "location_id" })
    location!: StockLocation;

    @Column({ name: "location_id" })
    location_id!: string;

    @Column({ type: "int", default: 0 })
    quantity!: number;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}