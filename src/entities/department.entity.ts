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
} from "typeorm";
import { StockRequisition } from "./stock-requisition.entity";
import { User } from "./user.entity";

export interface IDepartment {
    name: string;
    cost_center_code: string;
    manager: User;
    updated_by?: number;
}

@Entity("department")
export class Department extends BaseEntity implements IDepartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", name: "cost_center_code", length: 50 })
    cost_center_code: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "manager_id" })
    manager: User;

    @OneToMany(() => StockRequisition, (req) => req.department)
    requisitions: StockRequisition[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "int", nullable: true })
    updated_by?: number;

    constructor(department: IDepartment) {
        super();
        Object.assign(this, department);
    }

}


