import { AppDataSource } from "../infra/config/data-source";
import { Movement, MovementType } from "../infra/entities/movement.entity";
import { MovementEntry } from "../infra/entities/movement-entry.entity";
import { MovementExit } from "../infra/entities/movement-exit.entity";
import { getStartOfDay, getEndOfDay } from "../utils/date.util";
import { MovementExitQuery } from "../dtos/movement.dto";
import { FindManyOptions, FindOptionsWhere, Between, LessThanOrEqual, MoreThanOrEqual, Not, IsNull } from "typeorm";

const movementRepository = AppDataSource.getRepository(Movement);
const movementEntryRepository = AppDataSource.getRepository(MovementEntry);
const movementExitRepository = AppDataSource.getRepository(MovementExit);

async function getGrandTotalQuantity(type: MovementType): Promise<number> {
    const qb = movementRepository.createQueryBuilder("movement");
    if (type === MovementType.IN) {
        qb.where("movement.movement_entry_id IS NOT NULL");
    } else {
        qb.where("movement.movement_exit_id IS NOT NULL");
    }
    const result = await qb.select("SUM(movement.quantity)", "total").getRawOne();
    return Math.abs(Number(result?.total || 0));
}

async function getTotalQuantityByDateRange(
    type: MovementType,
    startDate: string | Date,
    endDate: string | Date
): Promise<number> {
    const qb = movementRepository.createQueryBuilder("movement");
    if (type === MovementType.IN) {
        qb.where("movement.movement_entry_id IS NOT NULL");
    } else {
        qb.where("movement.movement_exit_id IS NOT NULL");
    }
    qb.andWhere("movement.created_at >= :startDate", { startDate })
        .andWhere("movement.created_at < :endDate", { endDate });

    const result = await qb.select("SUM(movement.quantity)", "total").getRawOne();
    return Math.abs(Number(result?.total || 0));
}

async function getMovementEntries(): Promise<MovementEntry[]> {
    return await movementEntryRepository.find({
        relations: ["purchase"],
        order: { entryDate: "DESC" }
    });
}

async function getMovementEntryById(id: number): Promise<MovementEntry | null> {
    return await movementEntryRepository.findOne({
        where: { id },
        relations: ["purchase", "movements", "movements.product", "movements.stock_location"]
    });
}

async function getMovementExits(filters: MovementExitQuery = {}): Promise<[MovementExit[], number]> {
    const { pageIndex, pageSize, sortBy, sortOrder, exitMovementCategory, startDate, endDate, stockLocationId, activeOnly = true } = filters;

    const where: FindOptionsWhere<MovementExit> = {};

    if (exitMovementCategory) {
        where.exitMovementCategory = exitMovementCategory as any;
    }

    if (startDate && endDate) {
        where.exitDate = Between(getStartOfDay(startDate), getEndOfDay(endDate));
    } else if (startDate) {
        where.exitDate = MoreThanOrEqual(getStartOfDay(startDate));
    } else if (endDate) {
        where.exitDate = LessThanOrEqual(getEndOfDay(endDate));
    }

    if (stockLocationId) {
        where.movements = {
            stock_location: {
                id: stockLocationId
            }
        };
    }

    const options: FindManyOptions<MovementExit> = {
        where,
        relations: ["stockRequisition", "purchase", "movements", "movements.product", "movements.stock_location"],
        withDeleted: !activeOnly,
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    } else {
        options.order = { exitDate: "DESC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
    }

    return await movementExitRepository.findAndCount(options);
}

async function getMovementExitById(id: number): Promise<MovementExit | null> {
    return await movementExitRepository.findOne({
        where: { id },
        relations: ["stockRequisition", "purchase", "movements", "movements.product", "movements.stock_location"]
    });
}

export {
    getGrandTotalQuantity,
    getTotalQuantityByDateRange,
    getMovementEntries,
    getMovementEntryById,
    getMovementExits,
    getMovementExitById
};