import {
    Entity,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { Purchase } from "./purchase.entity";
import { StockMovement } from "./stock-movement.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IStockMovementEntry extends ITerranoBaseEntity {
    purchase?: Purchase;
}

@Entity("stock_movement_entry")
export class StockMovementEntry extends TerranoBaseEntity implements IStockMovementEntry {

    @ManyToOne(() => Purchase, { nullable: true })
    @JoinColumn({ name: "purchase_id" })
    purchase?: Purchase;

    @OneToMany(() => StockMovement, (movement) => movement.movement_entry)
    stock_movements: StockMovement[];

    constructor(entry: IStockMovementEntry) {
        super(entry);
        Object.assign(this, entry);
    }
}