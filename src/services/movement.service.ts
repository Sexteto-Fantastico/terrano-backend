import { BadRequestError, NotFoundError } from "../errors";
import { AppDataSource } from "../infra/config/data-source";
import { Movement } from "../infra/entities/movement.entity";
import { MovementExit } from "../infra/entities/movement-exit.entity";
import { StockBalance } from "../infra/entities/stock-balance.entity";
import { Product } from "../infra/entities/product.entity";
import { StockLocation } from "../infra/entities/stock-location.entity";
import { CreateMovementExitBody } from "../dtos/movement.dto";

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

export { createMovementExit };
