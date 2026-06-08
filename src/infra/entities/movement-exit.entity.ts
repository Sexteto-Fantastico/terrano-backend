import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { Purchase } from "./purchase.entity";
import { StockRequisition } from "./stock-requisition.entity";
import { Movement } from "./movement.entity";

export enum ExitMovementCategory {
    MATERIAL_REQUEST = "MATERIAL_REQUEST",
    STOCK_LOCATION_TRANSFER = "STOCK_LOCATION_TRANSFER",
    DEFECTIVE = "DEFECTIVE",
    RETURN = "RETURN",
    ADJUSTMENT = "ADJUSTMENT",
}

export interface IMovementExit extends ITerranoBaseEntity {
    exitDate: Date;
    exitMovementCategory: ExitMovementCategory;
    purchase?: Purchase | null;
    stockRequisition?: StockRequisition | null;
    internalNotes?: string | null;
}

@Entity("movement_exit")
export class MovementExit extends TerranoBaseEntity implements IMovementExit {

    @Column({ name: "exit_date", type: "datetime" })
    exitDate: Date;

    @Column({
        type: "simple-enum",
        name: "exit_movement_category",
        enum: ExitMovementCategory
    })
    exitMovementCategory: ExitMovementCategory;

    @ManyToOne(() => Purchase, { nullable: true })
    @JoinColumn({ name: "purchase_id" })
    purchase: Purchase | null;

    @ManyToOne(() => StockRequisition, { nullable: true })
    @JoinColumn({ name: "stock_requisition_id" })
    stockRequisition: StockRequisition | null;

    @Column({ name: "internal_notes", type: "text", nullable: true })
    internalNotes: string | null;

    @OneToMany(() => Movement, (movement) => movement.movement_exit)
    movements: Movement[];

    constructor(exit: IMovementExit) {
        super(exit);
        Object.assign(this, exit);
    }
}
