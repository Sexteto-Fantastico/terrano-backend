import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { StockRequisition } from "./stock-requisition.entity";
import { User } from "./user.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IDepartment extends ITerranoBaseEntity {
    name: string;
    cost_center_code: string;
    manager: User;
    updated_by?: number;
}

@Entity("department")
export class Department extends TerranoBaseEntity implements IDepartment {

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", name: "cost_center_code", length: 50 })
    cost_center_code: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "manager_id" })
    manager: User;

    @OneToMany(() => StockRequisition, (req) => req.department)
    requisitions: StockRequisition[];

    constructor(department: IDepartment) {
        super(department);
        Object.assign(this, department);
    }
}


