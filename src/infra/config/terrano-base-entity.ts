import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";

export interface ITerranoBaseEntity {
    id: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    created_by?: number;
    updated_by?: number;
}

export class TerranoBaseEntity extends BaseEntity implements ITerranoBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @UpdateDateColumn()
    updated_at: Date

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deleted_at: Date;
   
    @Column({ name: "created_by", type: "int", nullable: true })
    created_by?: number;

    @Column({ name: "updated_by", type: "int", nullable: true })
    updated_by?: number;

    constructor(entity: ITerranoBaseEntity) {
        super();
        Object.assign(this, entity);
    }
}