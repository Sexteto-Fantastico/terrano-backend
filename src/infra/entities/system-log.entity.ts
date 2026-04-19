import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
} from "typeorm";
import { LogLevel } from "../logger/logger.interface";

@Entity("system_log")
export class SystemLog extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: LogLevel,
        default: LogLevel.ERROR,
    })
    level: LogLevel;

    @Column({ type: "varchar", length: 1000 })
    message: string;

    @Column({ name: "status_code", type: "int" })
    status_code: number;

    @Column({ name: "is_operational", type: "boolean", default: true })
    is_operational: boolean;

    @Column({ type: "text", nullable: true })
    stack?: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    path?: string;

    @Column({ type: "varchar", length: 10, nullable: true })
    method?: string;

    @Column({ type: "json", nullable: true })
    metadata?: Record<string, unknown>;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;
    
    @Column({ name: "entity_name", type: "varchar", length: 100, nullable: true })
    entity_name?: string;

    @Column({ name: "entity_id", type: "int", nullable: true })
    entity_id?: number;

    @Column({ name: "action", type: "varchar", length: 50, nullable: true })
    action?: string; 
}