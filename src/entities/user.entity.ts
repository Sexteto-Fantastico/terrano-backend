import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";
import { Role } from "./role.entity";
import { Department } from "./department.entity";

export interface IUser {
    name: string;
    phone?: string;
    username: string;
    password: string;
    role: Role;
    updated_by?: string;
    isActive?: boolean;
}
@Entity("user")
export class User extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone?: string;

    @Column({ type: "varchar", length: 50, unique: true })
    username: string;

    @Column({ type: "varchar", length: 100 })
    password: string;

    @ManyToOne(() => Role)
    @JoinColumn({ name: "role_id" })
    role: Role;

    @OneToMany(() => Department, (dept) => dept.manager)
    managed_departments: Department[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by?: string;

    @Column({ name: "is_active", type: "boolean", default: true })
    isActive: boolean = true;

    constructor(user: IUser) {
        super();
        Object.assign(this, user);
    }
}