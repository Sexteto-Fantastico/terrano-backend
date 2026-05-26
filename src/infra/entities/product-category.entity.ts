import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export interface IProductCategory extends ITerranoBaseEntity {
  name: string;
  description?: string;
  parent_id?: number;
  deleted_at?: Date;
  updated_by?: number;
}

@Entity("product_category")
export class ProductCategory
  extends TerranoBaseEntity
  implements IProductCategory
{
  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "parent_id", type: "int", nullable: true })
  parent_id?: number;

  @ManyToOne(() => ProductCategory, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: "parent_id" })
  parent?: ProductCategory;

  @OneToMany(() => ProductCategory, (category) => category.parent)
  children?: ProductCategory[];

  constructor(category: IProductCategory) {
    super(category);
    if (category) {
      Object.assign(this, category);
    }
  }
}
