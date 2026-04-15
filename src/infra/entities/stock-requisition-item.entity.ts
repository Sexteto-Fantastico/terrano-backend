import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { StockRequisition } from "./stock-requisition.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IStockRequisitionItem extends ITerranoBaseEntity {
    item: string;
    declared_at: Date;
    product: Product;
    quantity: number;
    delivered: number;
    requisition: StockRequisition;
    updated_by?: number;
}

@Entity("stock_requisition_item")
export class StockRequisitionItem extends TerranoBaseEntity implements IStockRequisitionItem {

    @Column({ type: "varchar", length: 200 })
    item: string;

    @Column({ name: "declared_at", type: "date" })
    declared_at: Date;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "int", default: 0 })
    delivered: number;

    @ManyToOne(() => StockRequisition, (req) => req.items)
    @JoinColumn({ name: "requisition_id" })
    requisition: StockRequisition;

    constructor(item: IStockRequisitionItem) {
        super(item);
        Object.assign(this, item);
    }
}


