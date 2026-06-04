import { AppDataSource } from "../infra/config/data-source";
import { PurchasePayment } from "../infra/entities/purchase-payment.entity";

const repo = AppDataSource.getRepository(PurchasePayment);

async function getPaymentsByPurchaseId(purchaseId: number, withDeleted = false): Promise<PurchasePayment[]> {
    return repo.find({ where: { purchase: { id: purchaseId } }, withDeleted });
}

async function getPaymentById(id: number, withDeleted = false): Promise<PurchasePayment | null> {
    return repo.findOne({ where: { id }, withDeleted });
}

async function savePayment(payment: PurchasePayment): Promise<PurchasePayment> {
    return await repo.save(payment);
}

async function removePayment(payment: PurchasePayment): Promise<PurchasePayment> {
    return await repo.softRemove(payment);
}

async function recoverPayment(payment: PurchasePayment): Promise<PurchasePayment> {
    return await repo.recover(payment);
}

export { getPaymentsByPurchaseId, getPaymentById, savePayment, removePayment, recoverPayment };
