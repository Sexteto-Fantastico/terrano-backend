import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";

export interface IProductCategory {
    name: string;
    description?: string;
    is_active: boolean;
    updated_by: string;
}

@Entity("product_category")
export class ProductCategory extends BaseEntity implements IProductCategory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 200 })
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "boolean", name: "is_active", default: true })
    is_active: boolean;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by: string;

    constructor(category: IProductCategory) {
        super();
        Object.assign(this, category);
    }
}