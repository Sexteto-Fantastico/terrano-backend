import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Product } from "./product.entity";
import { StockLocation } from "./stock-location.entity";
import { MovementEntry } from "./movement-entry.entity";
import { MovementExit } from "./movement-exit.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export enum MovementType {
    IN = "IN",
    OUT = "OUT"
}

export interface IMovement extends ITerranoBaseEntity {
    product: Product;
    quantity: number;
    movement_exit?: MovementExit | null;
    movement_entry?: MovementEntry | null;
    stock_location: StockLocation;
}

@Entity("movement")
export class Movement extends TerranoBaseEntity implements IMovement {

    @ManyToOne(() => Product, (product) => product.stock_movements)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ type: "int" })
    quantity: number;

    @ManyToOne(() => MovementExit, (exit) => exit.movements, { nullable: true })
    @JoinColumn({ name: "movement_exit_id" })
    movement_exit: MovementExit | null;

    @ManyToOne(() => MovementEntry, (entry) => entry.movements, { nullable: true })
    @JoinColumn({ name: "movement_entry_id" })
    movement_entry: MovementEntry | null;

    @ManyToOne(() => StockLocation, (location) => location.stock_movements)
    @JoinColumn({ name: "stock_location_id" })
    stock_location: StockLocation;

    constructor(movement: IMovement) {
        super(movement);
        Object.assign(this, movement);
    }
}
