import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { Product } from "./product.entity";
import { MaterialRequest } from "./material-request.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IMaterialRequestItem extends ITerranoBaseEntity {
    product: Product;
    quantity: number;
    delivered: boolean;
    material_request: MaterialRequest;
}

@Entity("material_request_item")
export class MaterialRequestItem extends TerranoBaseEntity implements IMaterialRequestItem {

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ type: "integer" })
    quantity: number;

    @Column({ type: "boolean", default: false })
    delivered: boolean;

    @ManyToOne(() => MaterialRequest, request => request.items)
    @JoinColumn({ name: "material_request_id" })
    material_request: MaterialRequest;

    constructor(item: IMaterialRequestItem) {
        super(item);
        Object.assign(this, item);
    }
}