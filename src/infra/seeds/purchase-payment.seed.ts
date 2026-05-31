import { AppDataSource } from "../config/data-source";
import {
    PurchasePayment,
    PurchasePaymentMethod,
} from "../entities/purchase-payment.entity";

import { Purchase } from "../entities/purchase.entity";

export async function createPurchasePaymentSeed(): Promise<void> {

    const repository =
        AppDataSource.getRepository(PurchasePayment);

    const purchases =
        await AppDataSource
            .getRepository(Purchase)
            .find();

    const methods = [
        PurchasePaymentMethod.PIX,
        PurchasePaymentMethod.CASH,
        PurchasePaymentMethod.CREDIT_CARD,
        PurchasePaymentMethod.DEBIT_CARD,
        PurchasePaymentMethod.BANK_TRANSFER,
    ];

    for (const purchase of purchases) {

        const exists =
            await repository.findOne({
                where: {
                    purchase: {
                        id: purchase.id,
                    },
                },
            });

        if (exists) continue;

        await repository.save(
            repository.create({
                purchase,
                total: purchase.total,
                payment_method:
                    methods[
                        Math.floor(
                            Math.random() * methods.length
                        )
                    ],
            })
        );
    }

    console.log("PurchasePayment seed completed");
}