import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { StockLocation } from "./stock-location.entity";
import { StockMovementEntry } from "./stock-movement-entry.entity";
import { StockMovementOutput } from "./stock-movement-output.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IStockMovement extends ITerranoBaseEntity {
    product: Product;
    location: StockLocation;
    movement_entry?: StockMovementEntry;
    movement_output?: StockMovementOutput;
    quantity: number;
    unit_cost: number;
}

@Entity("stock_movement")
export class StockMovement extends TerranoBaseEntity implements IStockMovement {

    @ManyToOne(() => Product, (product) => product.stock_movements)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => StockLocation, (location) => location.stock_movements)
    @JoinColumn({ name: "location_id" })
    location: StockLocation;

    @ManyToOne(() => StockMovementEntry, (entry) => entry.stock_movements, { nullable: true })
    @JoinColumn({ name: "movement_entry_id" })
    movement_entry?: StockMovementEntry;

    @ManyToOne(() => StockMovementOutput, (output) => output.stock_movements, { nullable: true })
    @JoinColumn({ name: "movement_output_id" })
    movement_output?: StockMovementOutput;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "real" })
    unit_cost: number;

    constructor(movement: IStockMovement) {
        super(movement);
        Object.assign(this, movement);
    }
}