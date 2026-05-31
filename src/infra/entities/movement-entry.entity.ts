import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { Purchase } from "./purchase.entity";
import { Movement } from "./movement.entity";

export enum EntryMovementCategory {
    PURCHASE = "PURCHASE",
    ADJUSTMENT = "ADJUSTMENT",
}

export interface IMovementEntry extends ITerranoBaseEntity {
    entryDate: Date;
    entryMovementCategory: EntryMovementCategory;
    purchase?: Purchase | null;
}

@Entity("movement_entry")
export class MovementEntry extends TerranoBaseEntity implements IMovementEntry {

    @Column({ name: "entry_date", type: "datetime" })
    entryDate: Date;

    @Column({
        type: "simple-enum",
        name: "entry_movement_category",
        enum: EntryMovementCategory
    })
    entryMovementCategory: EntryMovementCategory;

    @ManyToOne(() => Purchase, { nullable: true })
    @JoinColumn({ name: "purchase_id" })
    purchase: Purchase | null;

    @OneToMany(() => Movement, (movement) => movement.movement_entry)
    movements: Movement[];

    constructor(entry: IMovementEntry) {
        super(entry);
        Object.assign(this, entry);
    }
}
