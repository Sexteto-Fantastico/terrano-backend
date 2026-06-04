import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,JoinColumn
} from "typeorm";

import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { StockRequisitionItem } from "./stock-requisition-item.entity";
import { StockRequisitionStatusLog } from "./stock-requisition-status-log.entity";
import { Department } from "./department.entity";



export enum RequisitionStatus {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    DENIED = "DENIED",
    APPROVED = "APPROVED",
    WAITING_PURCHASE = "WAITING_PURCHASE",
    WAITING_ARRIVAL = "WAITING_ARRIVAL",
    FINISHED = "FINISHED",
}

export interface IStockRequisition extends ITerranoBaseEntity {
    requester_justification: string;
    status: RequisitionStatus;
    items: StockRequisitionItem[];
    status_logs: StockRequisitionStatusLog[];
    updated_by?: number;
}

@Entity("stock_requisition")
export class StockRequisition extends TerranoBaseEntity implements IStockRequisition {

    @Column({
        type: "simple-enum",
        enum: RequisitionStatus,
        default: RequisitionStatus.PENDING
    })
    status: RequisitionStatus;

    @Column({
        name: "requester_justification",
        type: "varchar",
        length: 500
    })
    requester_justification: string;

    @OneToMany(() => StockRequisitionItem, item => item.stock_requisition, {
        cascade: true
    })
    items: StockRequisitionItem[];

    @OneToMany(() => StockRequisitionStatusLog, log => log.stock_requisition)
    status_logs: StockRequisitionStatusLog[];

    @ManyToOne(() => Department, department => department.stock_requisitions)

    @JoinColumn({ name: "department_id" })
    department: Department;

    constructor(stockRequisition: IStockRequisition) {
        super(stockRequisition);
        Object.assign(this, stockRequisition);
    }
 
}