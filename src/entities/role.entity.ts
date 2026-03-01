import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Policy } from "./policy.entity";
import { User } from "./user.entity";

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 50, unique: true })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @ManyToMany(() => Policy)
    @JoinTable({
        name: "role_policies",
        joinColumn: { name: "role_id" },
        inverseJoinColumn: { name: "policy_id" }
    })
    policies!: Policy[];

    @OneToMany(() => User, (user) => user.role)
    users!: User[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}