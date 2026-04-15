import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Role } from "./role.entity";
import { Department } from "./department.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IUser extends ITerranoBaseEntity {
    name: string;
    phone?: string;
    cpf?: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    department: Department;
    updated_by?: number;
    is_active?: boolean;
}

@Entity("user")
export class User extends TerranoBaseEntity implements IUser {

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone?: string;

    @Column({ type: "varchar", length: 14, nullable: true })
    cpf?: string;

    @Column({ type: "varchar", length: 300, unique: true })
    email: string;

    @Column({ type: "varchar", length: 50, unique: true })
    username: string;

    @Column({ type: "varchar", length: 100 })
    password: string;

    @ManyToOne(() => Role)
    @JoinColumn({ name: "role_id" })
    role: Role;

    @ManyToOne(() => Department)
    @JoinColumn({ name: "department_id" })
    department: Department;

    @OneToMany(() => Department, (dept) => dept.manager)
    managed_departments: Department[];

    @Column({ name: "is_active", type: "boolean", default: true })
    is_active: boolean = true;

    constructor(user: IUser) {
        super(user);
        Object.assign(this, user);
    }
}