import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Supplier } from "./supplier.entity";
import { StockLocation } from "./stock-location.entity";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export interface IAddress extends ITerranoBaseEntity {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
}

@Entity("address")
export class Address extends TerranoBaseEntity implements IAddress {
  @Column({ type: "varchar", length: 255 })
  street: string;

  @Column({ type: "varchar", length: 20 })
  number: string;

  @Column({ type: "varchar", length: 100 })
  neighborhood: string;

  @Column({ type: "varchar", length: 100 })
  city: string;

  @Column({ type: "varchar", length: 100 })
  state: string;

  @Column({ type: "varchar", length: 100 })
  country: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  complement?: string;

  @OneToOne(() => Supplier, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "supplier_id" })
  supplier?: Supplier;

  @OneToOne(() => StockLocation, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "stock_location_id" })
  stock_location?: StockLocation;

  constructor(address: IAddress) {
    super(address);
    Object.assign(this, address);
  }
}
