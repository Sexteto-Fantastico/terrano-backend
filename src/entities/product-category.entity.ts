import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";

export interface IProductCategory {
    name: string;
    description?: string;
    deleted_at?: Date;
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

    @DeleteDateColumn({ name: "deleted_at" })
    deleted_at: Date;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @Column({ name: "updated_by", type: "uuid", nullable: true })
    updated_by: string;

    constructor(category?: IProductCategory) {
        super();
        if (category) {
            Object.assign(this, category);
        }
    }

}