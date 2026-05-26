import { Entity, Column, ManyToOne } from "typeorm";
import { PurchaseOrder } from "./purchase-order.entity";
import { Product } from "./product.entity";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export interface IPurchaseOrderItem extends ITerranoBaseEntity {
  purchase_order: PurchaseOrder;
  product: Product;
  quantity: number;
  unit_price: number;
}

@Entity("purchase_order_item")
export class PurchaseOrderItem
  extends TerranoBaseEntity
  implements IPurchaseOrderItem
{
  @ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: "CASCADE" })
  purchase_order: PurchaseOrder;

  @ManyToOne(() => Product, (product) => product.purchase_order_items)
  product: Product;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "real" })
  unit_price: number;

  @Column({ type: "real" })
  subtotal: number;

  constructor(item: IPurchaseOrderItem) {
    super(item);
    Object.assign(this, item);
  }
}
