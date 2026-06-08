import { BadRequestError, NotFoundError } from "../errors";
import { AppDataSource } from "../infra/config/data-source";
import { Movement } from "../infra/entities/movement.entity";
import { MovementExit } from "../infra/entities/movement-exit.entity";
import { StockBalance } from "../infra/entities/stock-balance.entity";
import { Product } from "../infra/entities/product.entity";
import { StockLocation } from "../infra/entities/stock-location.entity";
import { CreateMovementExitBody, CreateMovementEntryBody, MovementExitQuery } from "../dtos/movement.dto";
import { MovementEntry } from "../infra/entities/movement-entry.entity";
import { Purchase } from "../infra/entities/purchase.entity";
import { StockRequisition, RequisitionStatus } from "../infra/entities/stock-requisition.entity";
import { ExitMovementCategory } from "../infra/entities/movement-exit.entity";
import { getMovementEntries, getMovementEntryById, getMovementExitById, getMovementExits } from "../repositories/movement.repository";

async function createMovementExit(data: CreateMovementExitBody): Promise<MovementExit> {
    const { stockLocationId, category, internalNotes, stockRequisitionId, items } = data;

    return await AppDataSource.manager.transaction(async (manager) => {
        const location = await manager.findOne(StockLocation, { where: { id: stockLocationId } });
        if (!location) throw new NotFoundError("Stock location not found");

        let stockRequisition = null;
        if (category === ExitMovementCategory.MATERIAL_REQUEST) {
            if (!stockRequisitionId) throw new BadRequestError("Stock requisition ID is required for MATERIAL_REQUEST");
            stockRequisition = await manager.findOne(StockRequisition, { where: { id: stockRequisitionId } });
            if (!stockRequisition) throw new NotFoundError("Stock requisition not found");
            if (stockRequisition.status !== RequisitionStatus.APPROVED) {
                throw new BadRequestError("Stock requisition is not approved");
            }
            stockRequisition.status = RequisitionStatus.FINISHED;
            await manager.save(stockRequisition);
        }

        const movementExit = new MovementExit({
            exitDate: new Date(),
            exitMovementCategory: category,
            internalNotes: internalNotes || null,
            purchase: null,
            stockRequisition: stockRequisition
        });
        const savedExit = await manager.save(movementExit);

        for (const item of items) {
            const product = await manager.findOne(Product, { where: { id: item.productId } });
            if (!product) throw new NotFoundError(`Product ${item.productId} not found`);

            let balance = await manager.findOne(StockBalance, {
                where: {
                    product: { id: item.productId },
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

            if (balance.quantity < item.quantity) {
                throw new BadRequestError(`Insufficient stock for product ${product.name} (Available: ${balance.quantity}, Requested: ${item.quantity})`);
            }

            const movement = new Movement({
                product,
                quantity: -item.quantity,
                unit_cost: item.unitCost,
                movement_exit: savedExit,
                movement_entry: null,
                stock_location: location
            });
            await manager.save(movement);

            balance.quantity -= item.quantity;
            await manager.save(balance);
        }

        return savedExit;
    });
}

async function listMovementExits(filters: MovementExitQuery = {}): Promise<[MovementExit[], number]> {
    return await getMovementExits(filters);
}

async function findMovementExit(id: number): Promise<MovementExit> {
    const exit = await getMovementExitById(id);
    if (!exit) {
        throw new NotFoundError("Movement exit not found");
    }
    return exit;
}

async function deleteMovementExit(id: number): Promise<void> {
    return await AppDataSource.manager.transaction(async (manager) => {
        const exit = await manager.findOne(MovementExit, {
            where: { id },
            relations: ["movements", "movements.product", "movements.stock_location", "stockRequisition"]
        });

        if (!exit) {
            throw new NotFoundError("Movement exit not found");
        }

        if (exit.deleted_at) {
            throw new BadRequestError("Movement exit is already inactive");
        }

        if (exit.movements) {
            for (const movement of exit.movements) {
                const balance = await manager.findOne(StockBalance, {
                    where: {
                        product: { id: movement.product.id },
                        location: { id: movement.stock_location.id }
                    }
                });

                if (balance) {
                    balance.quantity += Math.abs(movement.quantity);
                    await manager.save(balance);
                }
            }
        }

        if (exit.exitMovementCategory === ExitMovementCategory.MATERIAL_REQUEST && exit.stockRequisition) {
            exit.stockRequisition.status = RequisitionStatus.APPROVED;
            await manager.save(exit.stockRequisition);
        }

        await manager.softRemove(exit);
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
    createMovementExit,
    listMovementExits,
    findMovementExit,
    deleteMovementExit
};
