import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/product.entity";
import { StockRequisition } from "../entities/stock-requisition.entity";
import { StockRequisitionItem } from "../entities/stock-requisition-item.entity";

export async function createStockRequisitionItemSeed(): Promise<void> {

    const requisitionRepository =
        AppDataSource.getRepository(StockRequisition);

    const itemRepository =
        AppDataSource.getRepository(StockRequisitionItem);

    const productRepository =
        AppDataSource.getRepository(Product);

    const requisitions =
        await requisitionRepository.find();

    const products =
        await productRepository.find();

    for (const requisition of requisitions) {

        const existingItems =
            await itemRepository.count({
                where: {
                    requisition: {
                        id: requisition.id,
                    },
                },
            });

        if (existingItems > 0) {
            continue;
        }

        const itemCount =
            Math.floor(Math.random() * 7) + 2;

        let requisitionTotal = 0;

        for (let i = 0; i < itemCount; i++) {

            const product =
                products[
                    Math.floor(Math.random() * products.length)
                ];

            const quantity =
                Math.floor(Math.random() * 15) + 1;

            const delivered =
                requisition.status === "COMPLETED"
                    ? quantity
                    : Math.floor(quantity / 2);

            const unitPrice =
                Math.floor(Math.random() * 300) + 10;

            requisitionTotal +=
                quantity * unitPrice;

            await itemRepository.save(
                itemRepository.create({
                    item: product.name,
                    declared_at: requisition.declared_at,
                    product,
                    quantity,
                    delivered,
                    requisition,
                })
            );
        }

        requisition.total_value =
            Number(requisitionTotal.toFixed(2));

        await requisitionRepository.save(requisition);
    }

    console.log("StockRequisitionItem seed completed");
}