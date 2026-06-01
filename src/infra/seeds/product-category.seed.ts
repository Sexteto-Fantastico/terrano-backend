import { AppDataSource } from "../config/data-source";
import { ProductCategory } from "../entities/product-category.entity";

export async function createProductCategorySeed(): Promise<void> {
    const repository = AppDataSource.getRepository(ProductCategory);

    const categories = [
        {
            name: "Ferramentas",
            description: "Ferramentas manuais e elétricas",
        },
        {
            name: "EPIs",
            description: "Equipamentos de proteção individual",
        },
        {
            name: "Material Elétrico",
            description: "Itens elétricos",
        },
        {
            name: "Material Hidráulico",
            description: "Itens hidráulicos",
        },
        {
            name: "Informática",
            description: "Equipamentos e acessórios de TI",
        },
        {
            name: "Fixação",
            description: "Parafusos e fixadores",
        },
        {
            name: "Limpeza",
            description: "Materiais de limpeza",
        },
    ];

    for (const categoryData of categories) {
        const exists = await repository.findOne({
            where: {
                name: categoryData.name,
            },
        });

        if (exists) {
            continue;
        }

        await repository.save(
            repository.create(categoryData)
        );
    }

    console.log("ProductCategory seed completed");
}