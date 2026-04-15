import {
    Entity,
    Column,
    OneToMany,
} from "typeorm";
import { StockMovement } from "./stock-movement.entity";
import { StockLocationProduct } from "./stock-location-product.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IStockLocation extends ITerranoBaseEntity {
    name: string;
    description?: string;
    deleted_at?: Date;
    updated_by?: number;
}

@Entity("stock_location")
export class StockLocation extends TerranoBaseEntity implements IStockLocation {

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @OneToMany(() => StockLocationProduct, (slp) => slp.location)
    stock_location_products: StockLocationProduct[];

    @OneToMany(() => StockMovement, (movement) => movement.location)
    stock_movements: StockMovement[];

    constructor(location: IStockLocation) {
        super(location);
        Object.assign(this, location);
    }
}