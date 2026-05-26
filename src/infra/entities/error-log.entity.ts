import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { LogLevel } from "../logger/logger.interface";

@Entity("error_log")
export class ErrorLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "simple-enum",
    enum: LogLevel,
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

  @Column({ type: "simple-json", nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;
}
