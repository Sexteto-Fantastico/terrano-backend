import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Role } from "./role.entity";
import { Department } from "./department.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 20, nullable: true })
    phone!: string;

    @Column({ length: 50, unique: true })
    username!: string;

    @Column()
    password!: string;

    @ManyToOne(() => Role)
    @JoinColumn({ name: "role_id" })
    role!: Role;

    @Column({ name: "role_id" })
    role_id!: string;

    @OneToMany(() => Department, (dept) => dept.manager)
    managed_departments!: Department[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}