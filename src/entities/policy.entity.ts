import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";
import { Role } from "./role.entity";

export interface IPolicy {
    name: string;
    description?: string;
    resource: string;
    action: string;
    updated_by: string;
}

@Entity("policy")
export class Policy extends BaseEntity implements IPolicy {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100, unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "varchar", length: 50 })
    resource: string;

    @Column({ type: "varchar", length: 50 })
    action: string;

    @ManyToMany(() => Role, (role) => role.policies)
    roles: Role[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by: string;

    constructor(policy: IPolicy) {
        super();
        Object.assign(this, policy);
    }
}