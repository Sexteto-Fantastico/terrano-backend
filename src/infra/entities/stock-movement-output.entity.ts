import {
    Entity,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { StockRequisition } from "./stock-requisition.entity";
import { StockMovement } from "./stock-movement.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IStockMovementOutput extends ITerranoBaseEntity {
    requisition?: StockRequisition;
    updated_by?: number;
}

@Entity("stock_movement_output")
export class StockMovementOutput extends TerranoBaseEntity implements IStockMovementOutput {

    @ManyToOne(() => StockRequisition, { nullable: true })
    @JoinColumn({ name: "requisition_id" })
    requisition?: StockRequisition;

    @OneToMany(() => StockMovement, (movement) => movement.movement_output)
    stock_movements: StockMovement[];

    constructor(output: IStockMovementOutput) {
        super(output);
        Object.assign(this, output);
    }
}