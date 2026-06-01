import { AppDataSource } from "../config/data-source";
import { ProductBrand } from "../entities/product-brand.entity";

export async function createProductBrandSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(ProductBrand);

    const brands = [
        { name: "Bosch" },
        { name: "Makita" },
        { name: "Vonder" },
        { name: "Tramontina" },
        { name: "3M" },
        { name: "Intelbras" },
        { name: "Tigre" },
        { name: "Amanco" },
        { name: "Schneider Electric" },
        { name: "Legrand" },
        { name: "Furukawa" },
    ];

    for (const brandData of brands) {
        const exists = await repository.findOne({
            where: {
                name: brandData.name,
            },
        });

        if (exists) {
            continue;
        }

        await repository.save(
            repository.create({
                ...brandData,
                is_active: true,
            })
        );
    }

    console.log("ProductBrand seed completed");
}