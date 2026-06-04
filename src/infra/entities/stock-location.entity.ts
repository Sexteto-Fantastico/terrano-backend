import {
    Entity,
    Column,
    OneToMany,
} from "typeorm";
import { Movement } from "./movement.entity";
import { StockLocationProduct } from "./stock-location-product.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { OneToOne } from "typeorm";
import { Address } from "./address.entity";

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

    @OneToMany(() => Movement, (movement) => movement.stock_location)
    stock_movements: Movement[];

    @OneToOne(() => Address, (address) => address.stock_location)
    address: Address;

    constructor(location: IStockLocation) {
        super(location);
        Object.assign(this, location);
    }
}