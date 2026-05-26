import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { PurchaseOrderItem } from "./purchase-order-item.entity";
import { Supplier } from "./supplier.entity";
import { StockMovement } from "./stock-movement.entity";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  CONFIRMED = "CONFIRMED",
  RECEIVED = "RECEIVED",
  CANCELLED = "CANCELLED",
}

export interface IPurchaseOrder extends ITerranoBaseEntity {
  order_number: string;
  order_date: Date;
  status: PurchaseOrderStatus;
  supplier: Supplier;
  total: number;
  items: PurchaseOrderItem[];
  stock_movements?: StockMovement[];
  updated_by?: number;
}
@Entity("purchase_order")
export class PurchaseOrder extends TerranoBaseEntity implements IPurchaseOrder {
  @Column({ type: "varchar", length: 50, unique: true })
  order_number: string;

  @Column({ type: "date", name: "order_date" })
  order_date: Date;

  @Column({
    type: "simple-enum",
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: "supplier_id" })
  supplier: Supplier;

  @Column({ type: "real", default: 0 })
  total: number;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchase_order)
  items: PurchaseOrderItem[];

  @OneToMany(() => StockMovement, (movement) => movement.purchase_order)
  stock_movements: StockMovement[];

  constructor(order: IPurchaseOrder) {
    super(order);
    Object.assign(this, order);
  }
}
