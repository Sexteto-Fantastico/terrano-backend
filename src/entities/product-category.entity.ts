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

export interface IProductCategory {
    name: string;
    description?: string;
    parent_id?: string;
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

    @Column({ name: "parent_id", type: "uuid", nullable: true })
    parent_id?: string;

    @ManyToOne(() => ProductCategory, (category) => category.children, { nullable: true })
    @JoinColumn({ name: "parent_id" })
    parent?: ProductCategory;

    @OneToMany(() => ProductCategory, (category) => category.parent)
    children?: ProductCategory[];

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