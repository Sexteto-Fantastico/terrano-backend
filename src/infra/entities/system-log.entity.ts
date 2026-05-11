import { Entity, Column } from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface ISystemLog extends ITerranoBaseEntity {
    entity_name: string;
    entity_id?: number;
    action: string;
    user_id?: number;
    metadata?: Record<string, unknown>;
}

@Entity("system_log")
export class SystemLog extends TerranoBaseEntity implements ISystemLog {

    @Column({ name: "entity_name", type: "varchar", length: 100 })
    entity_name: string;

    @Column({ name: "entity_id", type: "int", nullable: true })
    entity_id?: number;

    @Column({ name: "action", type: "varchar", length: 50 })
    action: string;

    @Column({ name: "user_id", type: "int", nullable: true })
    user_id?: number;

    @Column({ type: "simple-json", nullable: true })
    metadata?: Record<string, unknown>;

    constructor(data: ISystemLog) {
        super(data);
        Object.assign(this, data);
    }
}