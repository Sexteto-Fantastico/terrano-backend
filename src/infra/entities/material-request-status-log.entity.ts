import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import {
    MaterialRequest,
    MaterialRequestStatus
} from "./material-request.entity";

import {
    TerranoBaseEntity,
    ITerranoBaseEntity
} from "../config/terrano-base-entity";

export interface IMaterialRequestStatusLog extends ITerranoBaseEntity {
    material_request: MaterialRequest;
    previous_status?: MaterialRequestStatus;
    current_status: MaterialRequestStatus;
    change_justification?: string;
}

@Entity("material_request_status_log")
export class MaterialRequestStatusLog extends TerranoBaseEntity implements IMaterialRequestStatusLog {

    @ManyToOne(() => MaterialRequest)
    @JoinColumn({ name: "material_request_id" })
    material_request: MaterialRequest;

    @Column({
        name: "previous_status",
        type: "varchar",
        nullable: true
    })
    previous_status?: MaterialRequestStatus;

    @Column({
        name: "current_status",
        type: "varchar"
    })
    current_status: MaterialRequestStatus;

    @Column({
        name: "change_justification",
        type: "varchar",
        length: 255,
        nullable: true
    })
    change_justification?: string;

    constructor(log: IMaterialRequestStatusLog) {
        super(log);
        Object.assign(this, log);
    }
}