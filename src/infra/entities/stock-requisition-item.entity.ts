import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { Product } from "./product.entity";
import { StockRequisition } from "./stock-requisition.entity";
import {
    TerranoBaseEntity,
    ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export interface IStockRequisitionItem extends ITerranoBaseEntity {
    product: Product;
    quantity: number;
    delivered: boolean;
    stock_requisition: StockRequisition;
    updated_by?: number;
}

@Entity("stock_requisition_item")
export class StockRequisitionItem
    extends TerranoBaseEntity
    implements IStockRequisitionItem {

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ type: "integer" })
    quantity: number;

    @Column({
        type: "boolean",
        default: false,
    })
    delivered: boolean;

    @ManyToOne(
        () => StockRequisition,
        requisition => requisition.items
    )
    @JoinColumn({ name: "stock_requisition_id" })
    stock_requisition: StockRequisition;

    constructor(item: IStockRequisitionItem) {
        super(item);
        Object.assign(this, item);
    }
}