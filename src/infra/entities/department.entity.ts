import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { StockRequisition } from "./stock-requisition.entity"
import { User } from "./user.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IDepartment extends ITerranoBaseEntity {
    name: string;
    manager: User;
    updated_by?: number;
}

@Entity("department")
export class Department extends TerranoBaseEntity implements IDepartment {

    @Column({ type: "varchar", length: 100 })
    name: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "manager_id" })
    manager: User;

    @OneToMany(() => StockRequisition, (req) => req.department)
    requisitions: StockRequisition[];

    constructor(department: IDepartment) {
        super(department);
        Object.assign(this, department);
    }
    @OneToMany(
    () => StockRequisition,
    requisition => requisition.department
)
stock_requisitions: StockRequisition[];
}


