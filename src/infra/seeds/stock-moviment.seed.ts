import { AppDataSource } from "../config/data-source";

import {
    StockMovement,
    MovementType,
} from "../entities/stock-movement.entity";

import { Product } from "../entities/product.entity";
import { Purchase } from "../entities/purchase.entity";
import { StockLocation } from "../entities/stock-location.entity";
import { StockRequisition } from "../entities/stock-requisition.entity";

export async function createStockMovementSeed(): Promise<void> {

    const repository =
        AppDataSource.getRepository(StockMovement);

    const productRepository =
        AppDataSource.getRepository(Product);

    const purchaseRepository =
        AppDataSource.getRepository(Purchase);

    const requisitionRepository =
        AppDataSource.getRepository(StockRequisition);

    const locationRepository =
        AppDataSource.getRepository(StockLocation);

    const products =
        await productRepository.find();

    const purchases =
        await purchaseRepository.find();

    const requisitions =
        await requisitionRepository.find();

    const locations =
        await locationRepository.find();

    const count = await repository.count();

    if (count > 0) {
        console.log("StockMovement already populated");
        return;
    }

    const movements: StockMovement[] = [];

    /*
     * ENTRADAS
     */

    for (let i = 0; i < 100; i++) {

        const product =
            products[Math.floor(Math.random() * products.length)];

        const purchase =
            purchases[Math.floor(Math.random() * purchases.length)];

        const location =
            locations[Math.floor(Math.random() * locations.length)];

        movements.push(
            repository.create({
                product,
                location,
                movement_type: MovementType.IN,
                purchase_order: purchase,
                requisition: null,
                quantity: Math.floor(Math.random() * 50) + 1,
                unit_cost: Number(
                    (Math.random() * 500 + 10).toFixed(2)
                ),
            })
        );
    }

    /*
     * SAÍDAS
     */

    for (let i = 0; i < 80; i++) {

        const product =
            products[Math.floor(Math.random() * products.length)];

        const requisition =
            requisitions[Math.floor(Math.random() * requisitions.length)];

        const location =
            locations[Math.floor(Math.random() * locations.length)];

        movements.push(
            repository.create({
                product,
                location,
                movement_type: MovementType.OUT,
                purchase_order: null,
                requisition,
                quantity: Math.floor(Math.random() * 20) + 1,
                unit_cost: Number(
                    (Math.random() * 500 + 10).toFixed(2)
                ),
            })
        );
    }

    /*
     * AJUSTES
     */

    for (let i = 0; i < 20; i++) {

        const product =
            products[Math.floor(Math.random() * products.length)];

        const location =
            locations[Math.floor(Math.random() * locations.length)];

        movements.push(
            repository.create({
                product,
                location,
                movement_type: MovementType.ADJUSTMENT,
                purchase_order: null,
                requisition: null,
                quantity: Math.floor(Math.random() * 15) + 1,
                unit_cost: Number(
                    (Math.random() * 500 + 10).toFixed(2)
                ),
            })
        );
    }

    await repository.save(movements);

    console.log("StockMovement seed completed");
}