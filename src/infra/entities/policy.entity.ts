import {
    Entity,
    Column,
    ManyToMany,
} from "typeorm";
import { Role } from "./role.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IPolicy extends ITerranoBaseEntity {
    name: string;
    description?: string;
    resource: string;
    action: string;
    updated_by?: number;
}

@Entity("policy")
export class Policy extends TerranoBaseEntity implements IPolicy {

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

    constructor(policy: IPolicy) {
        super(policy);
        Object.assign(this, policy);
    }
}