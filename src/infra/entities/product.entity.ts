import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { StockMovement } from "./stock-movement.entity";
import { StockLocationProduct } from "./stock-location-product.entity";
import { StockRequisitionItem } from "./stock-requisition-item.entity";
import { PurchaseItem } from "./purchase-item.entity";
import { ProductCategory } from "./product-category.entity";
import { ProductBrand } from "./product-brand.entity";
import { MeasurementUnit } from "./measurement-unit.entity";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";

export interface IProduct extends ITerranoBaseEntity {
    name: string;
    code: string;
    description?: string;
    category_id: number;
    category: ProductCategory;
    measurement_unit_id: number;
    measurement_unit: MeasurementUnit;
    brand_id: number;
    brand: ProductBrand;
    min_stock?: number;
    max_stock?: number;
    deleted_at?: Date;
    stock_movements?: StockMovement[];
    stock_location_products?: StockLocationProduct[];
    requisition_items?: StockRequisitionItem[];
    purchase_items?: PurchaseItem[];
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

    @Column({ type: "int" })
    category_id: number;

    @ManyToOne(() => ProductBrand, (brand) => brand.products)
    @JoinColumn({ name: "brand_id" })
    brand: ProductBrand;

    @Column({ type: "int" })
    brand_id: number;

    @Column({ name: "min_stock", type: "int", nullable: true })
    min_stock?: number;

    @Column({ name: "max_stock", type: "int", nullable: true })
    max_stock?: number;

    @ManyToOne(() => MeasurementUnit)
    @JoinColumn({ name: "measurement_unit_id" })
    measurement_unit: MeasurementUnit;

    @Column({ type: "int" })
    measurement_unit_id: number;

    @OneToMany(() => StockMovement, (movement) => movement.product)
    stock_movements?: StockMovement[];

    @OneToMany(() => StockLocationProduct, (slp) => slp.product)
    stock_location_products?: StockLocationProduct[];

    @OneToMany(() => StockRequisitionItem, (item) => item.product)
    requisition_items?: StockRequisitionItem[];

    @OneToMany(() => PurchaseItem, (item) => item.product)
    purchase_items?: PurchaseItem[];

    constructor(product: IProduct) {
        super(product);
        Object.assign(this, product);
    }
}
