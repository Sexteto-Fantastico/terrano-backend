import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import {
    StockRequisition,
    RequisitionStatus,
} from "./stock-requisition.entity";

import {
    TerranoBaseEntity,
    ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export interface IStockRequisitionStatusLog extends ITerranoBaseEntity {
    stock_requisition?: StockRequisition;
    stock_requisition_id?: number;
    previous_status?: RequisitionStatus;
    current_status: RequisitionStatus;
    change_justification?: string;
}

@Entity("stock_requisition_status_log")
export class StockRequisitionStatusLog
    extends TerranoBaseEntity
    implements IStockRequisitionStatusLog {

    @Column({
        name: "stock_requisition_id",
        type: "integer",
        nullable: false,
    })
    stock_requisition_id: number;

    @ManyToOne(
        () => StockRequisition,
        requisition => requisition.status_logs
    )
    @JoinColumn({ name: "stock_requisition_id" })
    stock_requisition?: StockRequisition;

    @Column({
        name: "previous_status",
        type: "varchar",
        nullable: true,
    })
    previous_status?: RequisitionStatus;

    @Column({
        name: "current_status",
        type: "varchar",
    })
    current_status: RequisitionStatus;

    @Column({
        name: "change_justification",
        type: "varchar",
        length: 255,
        nullable: true,
    })
    change_justification?: string;

    constructor(log?: Partial<IStockRequisitionStatusLog>) {
        super(log || {});
        Object.assign(this, log);
    }
}