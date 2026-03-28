import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";
import { StockMovement } from "./stock-movement.entity";
import { StockLocationProduct } from "./stock-location-product.entity";

export interface IStockLocation {
    name: string;
    description?: string;
    deleted_at?: Date;
    updated_by: string;
}

@Entity("stock_location")
export class StockLocation extends BaseEntity implements IStockLocation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @DeleteDateColumn({ name: "deleted_at" })
    deleted_at: Date;

    @OneToMany(() => StockLocationProduct, (slp) => slp.location)
    stock_location_products: StockLocationProduct[];

    @OneToMany(() => StockMovement, (movement) => movement.location)
    stock_movements: StockMovement[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by: string;

    constructor(location: IStockLocation) {
        super();
        Object.assign(this, location);
    }
}