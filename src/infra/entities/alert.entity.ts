import { Entity, Column, OneToMany } from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { AlertUser } from "./alert-user.entity";
import { AlertProductThreshold } from "./alert-product-threshold.entity";

export enum AlertType {
    PRODUCT_LOW_STOCK = "PRODUCT_LOW_STOCK",
    NEW_MATERIAL_REQUEST = "NEW_MATERIAL_REQUEST",
}

export interface IAlert extends ITerranoBaseEntity {
    name: string;
    description?: string;
    type: AlertType;
    recipients?: AlertUser[];
    productThresholds?: AlertProductThreshold[];
    updated_by?: number;
}

@Entity("alert")
export class Alert extends TerranoBaseEntity implements IAlert {
    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "simple-enum", enum: AlertType })
    type: AlertType;

    @OneToMany(() => AlertUser, (alertUser) => alertUser.alert, { cascade: true })
    recipients?: AlertUser[];

    @OneToMany(() => AlertProductThreshold, (threshold) => threshold.alert, { cascade: true })
    productThresholds?: AlertProductThreshold[];

    constructor(alert: IAlert) {
        super(alert);
        Object.assign(this, alert);
    }
}
