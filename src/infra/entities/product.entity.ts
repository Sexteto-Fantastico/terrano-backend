import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";
import { StockMovement } from "./stock-movement.entity";
import { StockLocationProduct } from "./stock-location-product.entity";
import { StockRequisitionItem } from "./stock-requisition-item.entity";
import { PurchaseOrderItem } from "./purchase-order-item.entity";
import { ProductCategory } from "./product-category.entity";
import { ProductBrand } from "./product-brand.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IProduct extends ITerranoBaseEntity {
    name: string;
    code: string;
    description?: string;
    category: ProductCategory;
    min_stock?: number;
    deleted_at?: Date;
    stock_movements?: StockMovement[];
    stock_location_products?: StockLocationProduct[];
    requisition_items?: StockRequisitionItem[];
    purchase_order_items?: PurchaseOrderItem[];
    updated_by?: number;
}

@Entity("product")
export class Product extends TerranoBaseEntity implements IProduct {
    @Column({ type: "varchar", length: 200 })
    name: string;

    @Column({ type: "varchar", length: 50, unique: true })
    code: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @ManyToOne(() => ProductCategory)
    @JoinColumn({ name: "category_id" })
    category: ProductCategory;

    @ManyToOne(() => ProductBrand, (brand) => brand.products)
    @JoinColumn({ name: "brand_id" })
    brand: ProductBrand;

    @Column({ name: "brand_id", type: "int", nullable: true })
    brand_id: number;

    @Column({ name: "min_stock", type: "int", default: 0 })
    min_stock?: number;

    @OneToMany(() => StockMovement, (movement) => movement.product)
    stock_movements?: StockMovement[];

    @OneToMany(() => StockLocationProduct, (slp) => slp.product)
    stock_location_products?: StockLocationProduct[];

    @OneToMany(() => StockRequisitionItem, (item) => item.product)
    requisition_items?: StockRequisitionItem[];

    @OneToMany(() => PurchaseOrderItem, (item) => item.product)
    purchase_order_items?: PurchaseOrderItem[];

    constructor(product: IProduct) {
        super(product);
        Object.assign(this, product);
    }
}


