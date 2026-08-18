import { AppDataSource } from "../infra/config/data-source";
import { Alert, AlertType } from "../infra/entities/alert.entity";
import { AlertUser } from "../infra/entities/alert-user.entity";
import { AlertProductThreshold } from "../infra/entities/alert-product-threshold.entity";
import { User } from "../infra/entities/user.entity";
import { Product } from "../infra/entities/product.entity";
import { sendEmail } from "./email.service";
import { NotFoundError, BadRequestError } from "../errors";
import {
    CreateAlertBody,
    UpdateAlertBody,
    AlertResponse,
    toAlertResponse,
    toAlertResponseList,
    AlertQuery,
} from "../dtos/alert.dto";
import * as AlertRepository from "../repositories/alert.repository";
import * as UserRepository from "../repositories/user.repository";
import * as ProductRepository from "../repositories/product.repository";

async function createAlert(data: CreateAlertBody): Promise<AlertResponse> {
    const alert = new Alert({
        name: data.name,
        description: data.description,
        type: data.type,
        recipients: [],
        productThresholds: [],
    });

    const created = await AppDataSource.transaction(async (manager) => {
        const savedAlert = await manager.save(alert);

        const users = await Promise.all(
            data.userIds.map(async (userId) => {
                const user = await UserRepository.getUserById(userId);
                if (!user) throw new NotFoundError(`User ${userId} not found`);
                return manager.save(new AlertUser({ alert: savedAlert, user }));
            })
        );

        const thresholds = await Promise.all(
            (data.productThresholds ?? []).map(async ({ productId, minQuantity }) => {
                const product = await ProductRepository.getProductById(productId, true);
                if (!product) throw new NotFoundError(`Product ${productId} not found`);
                return manager.save(new AlertProductThreshold({ alert: savedAlert, product, min_quantity: minQuantity }));
            })
        );

        savedAlert.recipients = users;
        savedAlert.productThresholds = thresholds;
        return savedAlert;
    });

    return toAlertResponse(created);
}

async function getAllAlerts(filters: AlertQuery = {}): Promise<[AlertResponse[], number]> {
    const [alerts, total] = await AlertRepository.getAllAlerts(filters);
    return [toAlertResponseList(alerts), total];
}

async function getAlertById(id: number): Promise<AlertResponse | null> {
    const alert = await AlertRepository.getAlertById(id, true);
    if (!alert) return null;
    return toAlertResponse(alert);
}

async function updateAlert(id: number, data: UpdateAlertBody): Promise<AlertResponse | null> {
    const alert = await AlertRepository.getAlertById(id, true);
    if (!alert) return null;

    if (data.name !== undefined) alert.name = data.name;
    if (data.description !== undefined) alert.description = data.description;
    if (data.type !== undefined) alert.type = data.type;

    await AppDataSource.transaction(async (manager) => {
        if (data.userIds) {
            await AlertRepository.deleteAlertUsersByAlertId(id);
            for (const userId of data.userIds) {
                const user = await UserRepository.getUserById(userId);
                if (!user) throw new NotFoundError(`User ${userId} not found`);
                await manager.save(new AlertUser({ alert, user }));
            }
        }

        if (data.productThresholds) {
            await AlertRepository.deleteAlertThresholdsByAlertId(id);
            for (const item of data.productThresholds) {
                const product = await ProductRepository.getProductById(item.productId, true);
                if (!product) throw new NotFoundError(`Product ${item.productId} not found`);
                await manager.save(new AlertProductThreshold({ alert, product, min_quantity: item.minQuantity }));
            }
        }

        await manager.save(alert);
    });

    const refreshed = await AlertRepository.getAlertById(id, true);
    return refreshed ? toAlertResponse(refreshed) : null;
}

async function deleteAlert(id: number): Promise<boolean> {
    const alert = await AlertRepository.getAlertById(id, false);
    if (!alert) return false;
    await AlertRepository.deleteAlert(alert);
    return true;
}

async function restoreAlert(id: number): Promise<AlertResponse | null> {
    const alert = await AlertRepository.getAlertById(id, true);
    if (!alert || !alert.deleted_at) return null;
    const restored = await AlertRepository.restoreAlert(alert);
    return toAlertResponse(restored);
}

async function checkLowStockAlerts(): Promise<void> {
    const alerts = await AlertRepository.getAllAlerts({ activeOnly: true, type: AlertType.PRODUCT_LOW_STOCK });
    const [allAlerts] = alerts;

    for (const alert of allAlerts) {
        for (const threshold of alert.productThresholds ?? []) {
            const product = threshold.product;
            const totalStock = await AppDataSource.getRepository(Product)
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.stock_location_products", "slp")
                .where("product.id = :productId", { productId: product.id })
                .select("COALESCE(SUM(slp.quantity), 0)", "totalStock")
                .getRawOne();

            const currentStock = Number(totalStock?.totalStock ?? 0);
            if (currentStock <= threshold.min_quantity) {
                const recipients = (alert.recipients ?? []).map((recipient) => recipient.user.email);
                if (recipients.length === 0) continue;

                await sendEmail({
                    to: recipients.join(", "),
                    template: {
                        subject: `Alerta de estoque mínimo: ${product.name}`,
                        text: `O produto ${product.name} está em nível crítico. Estoque atual: ${currentStock}. Mínimo configurado: ${threshold.min_quantity}.`,
                        html: `<p>O produto <strong>${product.name}</strong> está em nível crítico.</p><p>Estoque atual: <strong>${currentStock}</strong></p><p>Mínimo configurado: <strong>${threshold.min_quantity}</strong></p>`,
                    },
                });
            }
        }
    }
}

async function notifyNewMaterialRequestAlert(requisitionId: number | string): Promise<void> {
    const alerts = await AlertRepository.getAllAlerts({ activeOnly: true, type: AlertType.NEW_MATERIAL_REQUEST });
    const [allAlerts] = alerts;

    for (const alert of allAlerts) {
        const recipients = (alert.recipients ?? []).map((recipient) => recipient.user.email).filter(Boolean);
        if (recipients.length === 0) continue;

        await sendEmail({
            to: recipients.join(", "),
            template: {
                subject: "Nova solicitação de material registrada",
                text: `Foi registrada uma nova solicitação de material com ID ${requisitionId}.`,
                html: `<p>Foi registrada uma nova solicitação de material.</p><p>ID da solicitação: <strong>${requisitionId}</strong></p>`,
            },
        });
    }
}

export {
    createAlert,
    getAllAlerts,
    getAlertById,
    updateAlert,
    deleteAlert,
    restoreAlert,
    checkLowStockAlerts,
    notifyNewMaterialRequestAlert,
};
