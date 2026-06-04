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

    if (products.length === 0) {
        console.log(
            "No products found. Skipping StockRequisitionItem seed."
        );
        return;
    }

    for (const requisition of requisitions) {

        const existingItems =
            await itemRepository.count({
                where: {
                    stock_requisition: {
                        id: requisition.id,
                    },
                },
            });

        if (existingItems > 0) {
            continue;
        }

        const itemCount =
            Math.floor(Math.random() * 5) + 1;

        const items: StockRequisitionItem[] = [];

        for (let i = 0; i < itemCount; i++) {

            const product =
                products[
                    Math.floor(
                        Math.random() * products.length
                    )
                ];

            items.push(
                itemRepository.create({
                    stock_requisition: requisition,
                    product,
                    quantity:
                        Math.floor(Math.random() * 20) + 1,
                    delivered: false,
                })
            );
        }

        await itemRepository.save(items);
    }

    console.log("StockRequisitionItem seed completed");
}