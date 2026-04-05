import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";
import { Product } from "./product.entity";

export interface IProductBrand {
    name: string;
    is_active?: boolean;
    deleted_at?: Date;
    products?: Product[];
    updated_by?: number;
}

@Entity("product_brand")
export class ProductBrand extends BaseEntity implements IProductBrand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, unique: true })
    name: string;

    @Column({ type: "boolean", default: true })
    is_active?: boolean;

    @DeleteDateColumn({ name: "deleted_at" })
    deleted_at: Date;

    @OneToMany(() => Product, (product) => product.brand)
    products?: Product[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "int", nullable: true })
    updated_by?: number;

    constructor(brand: IProductBrand) {
        super();
        Object.assign(this, brand);
    }
}