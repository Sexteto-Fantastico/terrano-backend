import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/product.entity";
import { StockLocation } from "../entities/stock-location.entity";
import { StockBalance } from "../entities/stock-balance.entity";

export async function createStockBalanceSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(StockBalance);

    const products = await AppDataSource.getRepository(Product).find();

    const locations = await AppDataSource
        .getRepository(StockLocation)
        .find();

    for (const product of products) {

        const location =
            locations[Math.floor(Math.random() * locations.length)];

        const exists = await repository.findOne({
            where: {
                product: {
                    id: product.id,
                },
                location: {
                    id: location.id,
                },
            },
            relations: {
                product: true,
                location: true,
            },
        });

        if (exists) continue;

        await repository.save(
            repository.create({
                product,
                location,
                quantity: Math.floor(Math.random() * 150) + 10,
            })
        );
    }

    console.log("StockBalance seed completed");
}