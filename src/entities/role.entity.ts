import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";
import { Policy } from "./policy.entity";
import { User } from "./user.entity";

export interface IRole {
    name: string;
    description?: string;
    policies: Policy[];
    users?: User[];
    updated_by?: number;
}

@Entity("role")
export class Role extends BaseEntity implements IRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @ManyToMany(() => Policy)
    @JoinTable({
        name: "role_policies",
        joinColumn: { name: "role_id" },
        inverseJoinColumn: { name: "policy_id" }
    })
    policies: Policy[];

    @OneToMany(() => User, (user) => user.role)
    users?: User[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "int", nullable: true })
    updated_by?: number;

    constructor(role: IRole) {
        super();
        Object.assign(this, role);
    }
}


