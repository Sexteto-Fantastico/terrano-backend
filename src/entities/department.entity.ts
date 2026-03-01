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
import { StockRequisition } from "./stock-requisition.entity";
import { User } from "./user.entity";

@Entity("departments")
export class Department {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ name: "cost_center_code", length: 50 })
    cost_center_code!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "manager_id" })
    manager!: User;

    @Column({ name: "manager_id", nullable: true })
    manager_id!: string;

    @OneToMany(() => StockRequisition, (req) => req.department)
    requisitions!: StockRequisition[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}