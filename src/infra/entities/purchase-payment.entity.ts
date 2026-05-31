import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { TerranoBaseEntity, ITerranoBaseEntity } from "../config/terrano-base-entity";
import { Purchase } from "./purchase.entity";

export enum PurchasePaymentMethod {
    CASH = "CASH",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    PIX = "PIX",
}

export interface IPurchasePayment extends ITerranoBaseEntity {
   total: number;
   payment_method: PurchasePaymentMethod;
   purchase: Purchase;
}

@Entity("purchase_payment")
export class PurchasePayment extends TerranoBaseEntity implements IPurchasePayment {

    @Column({ type: "real" })
    total: number;

    @Column({
        type: "simple-enum",
        enum: PurchasePaymentMethod,
    })
    payment_method: PurchasePaymentMethod;

    @ManyToOne(() => Purchase)
    @JoinColumn({ name: "purchase_id" })
    purchase: Purchase;

    constructor(order: IPurchasePayment) {
        super(order);
        Object.assign(this, order);
    }
}