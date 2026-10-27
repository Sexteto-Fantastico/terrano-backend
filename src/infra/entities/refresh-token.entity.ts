import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("refresh_token")
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Index("IDX_refresh_token_user_id")
    @Column({ name: "user_id", type: "int" })
    user_id: number;

    @Index("IDX_refresh_token_token_hash", { unique: true })
    @Column({ name: "token_hash", type: "varchar", length: 64 })
    token_hash: string;

    @Index("IDX_refresh_token_family_id")
    @Column({ name: "family_id", type: "varchar", length: 64 })
    family_id: string;

    @Column({ name: "expires_at", type: "datetime" })
    expires_at: Date;

    @Column({ name: "revoked_at", type: "datetime", nullable: true })
    revoked_at?: Date | null;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;
}
