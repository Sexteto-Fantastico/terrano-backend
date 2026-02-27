import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StockMovement } from "./stock-movement.entity";

@Entity("stock_requisition")
export class StockRequisition {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToMany(() => StockMovement, (movement) => movement.requisition)
    stock_movements!: StockMovement[];
}
