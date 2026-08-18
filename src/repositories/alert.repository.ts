import { FindManyOptions, FindOptionsWhere, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { Alert } from "../infra/entities/alert.entity";
import { AlertUser } from "../infra/entities/alert-user.entity";
import { AlertProductThreshold } from "../infra/entities/alert-product-threshold.entity";
import { AlertQuery } from "../dtos/alert.dto";

const alertRepository = AppDataSource.getRepository(Alert);
const alertUserRepository = AppDataSource.getRepository(AlertUser);
const alertThresholdRepository = AppDataSource.getRepository(AlertProductThreshold);

async function createAlert(alert: Alert): Promise<Alert> {
    return await alertRepository.save(alert);
}

async function getAllAlerts(filters: AlertQuery = {}): Promise<[Alert[], number]> {
    const { name, type, activeOnly = true, pageIndex, pageSize, sortBy, sortOrder } = filters;

    const where: FindOptionsWhere<Alert> = {};

    if (name) where.name = ILike(`%${name}%`);
    if (type) where.type = type;

    const options: FindManyOptions<Alert> = {
        where,
        withDeleted: !activeOnly,
        relations: ["recipients", "recipients.user", "productThresholds", "productThresholds.product"],
        order: sortBy ? { [sortBy]: sortOrder ?? "ASC" } : { created_at: "DESC" },
    };

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return await alertRepository.findAndCount(options);
    }

    const results = await alertRepository.find(options);
    return [results, results.length];
}

async function getAlertById(id: number, withDeleted = false): Promise<Alert | null> {
    return await alertRepository.findOne({
        where: { id },
        withDeleted,
        relations: ["recipients", "recipients.user", "productThresholds", "productThresholds.product"],
    });
}

async function updateAlert(alert: Alert): Promise<Alert> {
    return await alertRepository.save(alert);
}

async function deleteAlert(alert: Alert): Promise<Alert> {
    return await alertRepository.softRemove(alert);
}

async function restoreAlert(alert: Alert): Promise<Alert> {
    return await alertRepository.recover(alert);
}

async function deleteAlertUsersByAlertId(alertId: number): Promise<void> {
    await alertUserRepository.delete({ alert: { id: alertId } });
}

async function deleteAlertThresholdsByAlertId(alertId: number): Promise<void> {
    await alertThresholdRepository.delete({ alert: { id: alertId } });
}

export {
    createAlert,
    getAllAlerts,
    getAlertById,
    updateAlert,
    deleteAlert,
    restoreAlert,
    deleteAlertUsersByAlertId,
    deleteAlertThresholdsByAlertId,
};
