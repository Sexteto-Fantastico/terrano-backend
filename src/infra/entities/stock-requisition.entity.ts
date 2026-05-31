import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";
import { StockRequisitionItem } from "./stock-requisition-item.entity";
import { Department } from "./department.entity";
import { Movement } from "./movement.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export enum RequisitionStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface IStockRequisition extends ITerranoBaseEntity {
    company_name: string;
    status: RequisitionStatus;
    declared_at: Date;
    total_value: number;
    department: Department;
    items: StockRequisitionItem[];
    stock_movements: Movement[];
    updated_by?: number;
}
@Entity("stock_requisition")
export class StockRequisition extends TerranoBaseEntity implements IStockRequisition {

    @Column({ type: "varchar", length: 200 })
    company_name: string;

    @Column({
        type: "simple-enum",
        enum: RequisitionStatus,
        default: RequisitionStatus.PENDING
    })
    status: RequisitionStatus;

    @Column({ name: "declared_at", type: "date" })
    declared_at: Date;

    @Column({ name: "total_value", type: "real", default: 0 })
    total_value: number;

    @ManyToOne(() => Department)
    @JoinColumn({ name: "department_id" })
    department: Department;

    @OneToMany(() => StockRequisitionItem, (item) => item.requisition)
    items: StockRequisitionItem[];

    @OneToMany(() => Movement, (movement) => (movement as any).requisition)
    stock_movements: Movement[];

    constructor(requisition: IStockRequisition) {
        super(requisition);
        Object.assign(this, requisition);
    }
}


