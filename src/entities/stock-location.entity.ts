import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { StockMovement } from "./stock-movement.entity";
import { StockLocationProduct } from "./stock-location-product.entity";

@Entity("stock_locations")
export class StockLocation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ name: "is_active", default: true })
    is_active!: boolean;

    @OneToMany(() => StockLocationProduct, (slp) => slp.location)
    stock_location_products!: StockLocationProduct[];

    @OneToMany(() => StockMovement, (movement) => movement.location)
    stock_movements!: StockMovement[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}