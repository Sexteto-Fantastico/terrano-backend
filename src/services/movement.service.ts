import { BadRequestError, NotFoundError } from "../errors";
import { AppDataSource } from "../infra/config/data-source";
import { Movement } from "../infra/entities/movement.entity";
import { MovementExit } from "../infra/entities/movement-exit.entity";
import { StockBalance } from "../infra/entities/stock-balance.entity";
import { Product } from "../infra/entities/product.entity";
import { StockLocation } from "../infra/entities/stock-location.entity";
import { CreateMovementExitBody,CreateMovementEntryBody } from "../dtos/movement.dto";
import { MovementEntry } from "../infra/entities/movement-entry.entity";
import { Purchase } from "../infra/entities/purchase.entity";
import { getMovementEntries, getMovementEntryById } from "../repositories/movement.repository"; // Ajuste o caminho


async function createMovementExit(data: CreateMovementExitBody): Promise<MovementExit> {
    const { productId, stockLocationId, quantity, category } = data;

    return await AppDataSource.manager.transaction(async (manager) => {
        const product = await manager.findOne(Product, { where: { id: productId } });
        if (!product) throw new NotFoundError("Product not found");

        const location = await manager.findOne(StockLocation, { where: { id: stockLocationId } });
        if (!location) throw new NotFoundError("Stock location not found");

        let balance = await manager.findOne(StockBalance, {
            where: {
                product: { id: productId },
                location: { id: stockLocationId }
            }
        });

        if (!balance) {
            balance = new StockBalance({
                product,
                location,
                quantity: 0
            });
        }

        if (balance.quantity < quantity) {
            throw new BadRequestError(`Insufficient stock for product ${product.name} (Available: ${balance.quantity}, Requested: ${quantity})`);
        }

        const movementExit = new MovementExit({
            exitDate: new Date(),
            exitMovementCategory: category,
            purchase: null,
            stockRequisition: null
        });
        const savedExit = await manager.save(movementExit);

        const movement = new Movement({
            product,
            quantity: -quantity,
            movement_exit: savedExit,
            movement_entry: null,
            stock_location: location
        });
        await manager.save(movement);

        balance.quantity -= quantity;
        await manager.save(balance);

        return savedExit;
    });
}

async function createMovementEntry(data: CreateMovementEntryBody): Promise<MovementEntry> {
    const { productId, stockLocationId, quantity, category, purchaseId } = data;

    return await AppDataSource.manager.transaction(async (manager) => {
        const product = await manager.findOne(Product, { where: { id: productId } });
        if (!product) throw new NotFoundError("Product not found");

        const location = await manager.findOne(StockLocation, { where: { id: stockLocationId } });
        if (!location) throw new NotFoundError("Stock location not found");

        let purchase = null;
        if (purchaseId) {
            purchase = await manager.findOne(Purchase, { where: { id: purchaseId } });
            if (!purchase) throw new NotFoundError("Purchase not found");
        }

        let balance = await manager.findOne(StockBalance, {
            where: {
                product: { id: productId },
                location: { id: stockLocationId }
            }
        });

        if (!balance) {
            balance = new StockBalance({
                product,
                location,
                quantity: 0
            });
        }

        const movementEntry = new MovementEntry({
            entryDate: new Date(),
            entryMovementCategory: category,
            purchase: purchase
        });
        const savedEntry = await manager.save(movementEntry);

        const movement = new Movement({
            product,
            quantity: quantity,
            movement_exit: null,
            movement_entry: savedEntry,
            stock_location: location
        });
        await manager.save(movement);
        
        balance.quantity += quantity;
        await manager.save(balance);

        return savedEntry;
    });
}

async function listMovementEntries(): Promise<MovementEntry[]> {
    return await getMovementEntries();
}

async function findMovementEntry(id: number): Promise<MovementEntry> {
    const entry = await getMovementEntryById(id);
    if (!entry) {
        throw new NotFoundError("Movement entry not found");
    }
    return entry;
}

export { 
    createMovementEntry,
    listMovementEntries,
    findMovementEntry,
    createMovementExit
 };
