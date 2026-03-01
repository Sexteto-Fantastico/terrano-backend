import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Role } from "./role.entity";

@Entity("policies")
export class Policy {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 100, unique: true })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ length: 50 })
    resource!: string;

    @Column({ length: 50 })
    action!: string;

    @ManyToMany(() => Role, (role) => role.policies)
    roles!: Role[];

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    last_updated!: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by!: string;
}