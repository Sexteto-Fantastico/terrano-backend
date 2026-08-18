import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { Alert } from "./alert.entity";
import { Product } from "./product.entity";

export interface IAlertProductThreshold extends ITerranoBaseEntity {
    alert: Alert;
    product: Product;
    min_quantity: number;
    updated_by?: number;
}

@Entity("alert_product_threshold")
export class AlertProductThreshold extends TerranoBaseEntity implements IAlertProductThreshold {
    @ManyToOne(() => Alert, (alert) => alert.productThresholds)
    @JoinColumn({ name: "alert_id" })
    alert: Alert;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ name: "min_quantity", type: "int", default: 0 })
    min_quantity: number;

    constructor(threshold: IAlertProductThreshold) {
        super(threshold);
        Object.assign(this, threshold);
    }
}
