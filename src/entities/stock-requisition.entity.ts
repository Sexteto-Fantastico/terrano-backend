import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { StockRequisitionItem } from "./stock-requisition-item.entity";
import { Department } from "./department.entity";
import { StockMovement } from "./stock-movement.entity";

export enum RequisitionStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

@Entity("stock_requisitions")
export class StockRequisition {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 200 })
    company_name!: string;

    @Column({
        type: "enum",
        enum: RequisitionStatus,
        default: RequisitionStatus.PENDING
    })
    status!: RequisitionStatus;

    @Column({ name: "declared_at", type: "date" })
    declared_at!: Date;

    @Column({ name: "total_value", type: "decimal", precision: 10, scale: 2, default: 0 })
    total_value!: number;

    @ManyToOne(() => Department)
    @JoinColumn({ name: "department_id" })
    department!: Department;

    @Column({ name: "department_id" })
    department_id!: string;

    @OneToMany(() => StockRequisitionItem, (item) => item.requisition)
    items!: StockRequisitionItem[];

    @OneToMany(() => StockMovement, (movement) => movement.requisition)
    stock_movements!: StockMovement[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}