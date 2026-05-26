import { Entity, Column, OneToMany } from "typeorm";
import { Product } from "./product.entity";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export interface IProductBrand extends ITerranoBaseEntity {
  name: string;
  is_active?: boolean;
  deleted_at?: Date;
  products?: Product[];
  updated_by?: number;
}

@Entity("product_brand")
export class ProductBrand extends TerranoBaseEntity implements IProductBrand {
  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "boolean", default: true })
  is_active?: boolean;

  @OneToMany(() => Product, (product) => product.brand)
  products?: Product[];

  constructor(brand: IProductBrand) {
    super(brand);
    Object.assign(this, brand);
  }
}
