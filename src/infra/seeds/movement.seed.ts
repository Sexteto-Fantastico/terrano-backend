import { AppDataSource } from "../config/data-source";
import { Movement } from "../entities/movement.entity";
import { MovementEntry, EntryMovementCategory } from "../entities/movement-entry.entity";
import { MovementExit, ExitMovementCategory } from "../entities/movement-exit.entity";
import { Purchase } from "../entities/purchase.entity";
import { PurchaseItem } from "../entities/purchase-item.entity";
import { StockLocation } from "../entities/stock-location.entity";
import { Product } from "../entities/product.entity";

export async function createMovementSeed(): Promise<void> {
    const movementRepository = AppDataSource.getRepository(Movement);
    const entryRepository = AppDataSource.getRepository(MovementEntry);
    const exitRepository = AppDataSource.getRepository(MovementExit);
    const purchaseRepository = AppDataSource.getRepository(Purchase);
    const purchaseItemRepository = AppDataSource.getRepository(PurchaseItem);
    const locationRepository = AppDataSource.getRepository(StockLocation);
    const productRepository = AppDataSource.getRepository(Product);

    const existingMovements = await movementRepository.count();
    if (existingMovements > 0) {
        console.log("Movements already seeded. Skipping...");
        return;
    }

    const locations = await locationRepository.find();
    if (locations.length === 0) throw new Error("No stock locations found. Run stock location seed first.");

    const products = await productRepository.find();
    if (products.length === 0) throw new Error("No products found. Run product seed first.");

    const purchases = await purchaseRepository.find({ take: 5 });

    for (const purchase of purchases) {
        const items = await purchaseItemRepository.find({
            where: { purchase: { id: purchase.id } },
            relations: ["product"]
        });

        if (items.length === 0) continue;
        const entry = entryRepository.create({
            entryDate: purchase.purchase_date, // Usa a data da compra
            entryMovementCategory: EntryMovementCategory.PURCHASE,
            purchase: purchase
        });
        const savedEntry = await entryRepository.save(entry);

        for (const item of items) {
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];

            const movement = movementRepository.create({
                product: item.product,
                quantity: item.quantity,
                movement_entry: savedEntry,
                movement_exit: null,
                stock_location: randomLocation
            });
            await movementRepository.save(movement);
        }
    }

    for (let i = 0; i < 5; i++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const isDefective = Math.random() > 0.5; // 50% de chance de ser defeito ou ajuste

        const exitDate = new Date();
        exitDate.setDate(exitDate.getDate() - Math.floor(Math.random() * 30)); // Data aleatória nos últimos 30 dias

        const exit = exitRepository.create({
            exitDate: exitDate,
            exitMovementCategory: isDefective ? ExitMovementCategory.DEFECTIVE : ExitMovementCategory.ADJUSTMENT,
            purchase: null,
            stockRequisition: null 
        });
        const savedExit = await exitRepository.save(exit);

        const exitQuantity = Math.floor(Math.random() * 5) + 1;

        const movement = movementRepository.create({
            product: randomProduct,
            quantity: -exitQuantity,
            movement_entry: null,
            movement_exit: savedExit,
            stock_location: randomLocation
        });
        await movementRepository.save(movement);
    }

    console.log("Movement (Entries & Exits) seed completed");
}