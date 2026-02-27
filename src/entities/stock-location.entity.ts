import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { StockMovement } from "./stock-movement.entity";

@Entity("stock_location")
export class StockLocation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToMany(() => StockMovement, (movement) => movement.location)
    stock_movements!: StockMovement[];
}
