import { AppDataSource } from "../config/data-source";
import { StockLocation } from "../entities/stock-location.entity";

export async function createStockLocationSeed(): Promise<void> {

    const repository =
        AppDataSource.getRepository(StockLocation);

    const locations = [
        {
            name: "Almoxarifado Central",
            description: "Local principal de armazenamento",
        },
        {
            name: "Estoque Produção",
            description: "Materiais destinados à produção",
        },
        {
            name: "Estoque Elétrica",
            description: "Materiais elétricos",
        },
        {
            name: "Estoque Hidráulica",
            description: "Materiais hidráulicos",
        },
        {
            name: "Estoque TI",
            description: "Equipamentos de informática",
        },
        {
            name: "Depósito Externo",
            description: "Armazenamento externo",
        },
    ];

    for (const locationData of locations) {

        const exists = await repository.findOne({
            where: {
                name: locationData.name,
            },
        });

        if (exists) continue;

        await repository.save(
            repository.create(locationData)
        );
    }

    console.log("StockLocation seed completed");
}