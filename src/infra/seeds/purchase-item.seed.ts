import { AppDataSource } from "../config/data-source";
import { Purchase } from "../entities/purchase.entity";
import { Product } from "../entities/product.entity";
import { PurchaseItem } from "../entities/purchase-item.entity";

export async function createPurchaseItemSeed(): Promise<void> {

    const purchaseRepository =
        AppDataSource.getRepository(Purchase);

    const productRepository =
        AppDataSource.getRepository(Product);

    const itemRepository =
        AppDataSource.getRepository(PurchaseItem);

    const purchases = await purchaseRepository.find();

    const products = await productRepository.find();

    for (const purchase of purchases) {

        const existingItems =
            await itemRepository.count({
                where: {
                    purchase: {
                        id: purchase.id,
                    },
                },
            });

        if (existingItems > 0) {
            continue;
        }

        const itemCount =
            Math.floor(Math.random() * 5) + 2;

        let purchaseTotal = 0;

        for (let i = 0; i < itemCount; i++) {

            const product =
                products[Math.floor(Math.random() * products.length)];

            const quantity =
                Math.floor(Math.random() * 20) + 1;

            const unitPrice =
                Number(
                    (Math.random() * 500 + 10)
                        .toFixed(2)
                );

            const total =
                quantity * unitPrice;

            purchaseTotal += total;

            await itemRepository.save(
                itemRepository.create({
                    purchase,
                    product,
                    quantity,
                    unit_price: unitPrice,
                    total,
                })
            );
        }

        purchase.total = Number(
            purchaseTotal.toFixed(2)
        );

        await purchaseRepository.save(purchase);
    }

    console.log("PurchaseItem seed completed");
}