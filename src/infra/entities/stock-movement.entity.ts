import { Entity, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { StockLocation } from "./stock-location.entity";
import { PurchaseOrder } from "./purchase-order.entity";
import { StockRequisition } from "./stock-requisition.entity";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export enum MovementType {
  IN = "IN",
  OUT = "OUT",
  TRANSFER = "TRANSFER",
  ADJUSTMENT = "ADJUSTMENT",
}

export interface IStockMovement extends ITerranoBaseEntity {
  product: Product;
  location: StockLocation;
  movement_type: MovementType;
  quantity: number;
  unit_cost: number;
}

@Entity("stock_movement")
export class StockMovement extends TerranoBaseEntity implements IStockMovement {
  @ManyToOne(() => Product, (product) => product.stock_movements)
  product: Product;

  @ManyToOne(() => StockLocation, (location) => location.stock_movements)
  location: StockLocation;

  @Column({ type: "simple-enum", enum: MovementType })
  movement_type: MovementType;

  @ManyToOne(() => PurchaseOrder, (po) => po.stock_movements, {
    nullable: true,
  })
  purchase_order: PurchaseOrder | null;

  @ManyToOne(() => StockRequisition, (req) => req.stock_movements, {
    nullable: true,
  })
  requisition: StockRequisition | null;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "real" })
  unit_cost: number;

  constructor(movement: IStockMovement) {
    super(movement);
    Object.assign(this, movement);
  }
}
