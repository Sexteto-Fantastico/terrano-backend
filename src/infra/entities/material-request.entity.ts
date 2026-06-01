import {
    Entity,
    Column,
    OneToMany,
} from "typeorm";

import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { MaterialRequestItem } from "./material-request-item.entity";
import { MaterialRequestStatusLog } from "./material-request-status-log.entity";

export enum MaterialRequestStatus {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    DENIED = "DENIED",
    APPROVED = "APPROVED",
    WAITING_PURCHASE = "WAITING_PURCHASE",
    WAITING_ARRIVAL = "WAITING_ARRIVAL",
    FINISHED = "FINISHED",
}

export interface IMaterialRequest extends ITerranoBaseEntity {
    requester_justification: string;
    status: MaterialRequestStatus;
    items: MaterialRequestItem[];
    status_logs: MaterialRequestStatusLog[];
    updated_by?: number;
}

@Entity("material_request")
export class MaterialRequest extends TerranoBaseEntity implements IMaterialRequest {

    @Column({
        type: "simple-enum",
        enum: MaterialRequestStatus,
        default: MaterialRequestStatus.PENDING
    })
    status: MaterialRequestStatus;

    @Column({
        name: "requester_justification",
        type: "varchar",
        length: 500
    })
    requester_justification: string;

    @OneToMany(() => MaterialRequestItem, item => item.material_request, {
        cascade: true
    })
    items: MaterialRequestItem[];

    @OneToMany(() => MaterialRequestStatusLog, log => log.material_request)
    status_logs: MaterialRequestStatusLog[];

    constructor(materialRequest: IMaterialRequest) {
        super(materialRequest);
        Object.assign(this, materialRequest);
    }
}