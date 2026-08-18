import { Entity, ManyToOne, JoinColumn } from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { Alert } from "./alert.entity";
import { User } from "./user.entity";

export interface IAlertUser extends ITerranoBaseEntity {
    alert: Alert;
    user: User;
    updated_by?: number;
}

@Entity("alert_user")
export class AlertUser extends TerranoBaseEntity implements IAlertUser {
    @ManyToOne(() => Alert, (alert) => alert.recipients)
    @JoinColumn({ name: "alert_id" })
    alert: Alert;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    constructor(alertUser: IAlertUser) {
        super(alertUser);
        Object.assign(this, alertUser);
    }
}
