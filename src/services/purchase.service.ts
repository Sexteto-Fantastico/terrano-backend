import { BadRequestError, NotFoundError } from "../errors";
import * as PurchaseRepository from "../repositories/purchase.repository";
import * as SupplierRepository from "../repositories/supplier.repository";
import * as ItemRepository from "../repositories/purchase-item.repository";
import * as PaymentRepository from "../repositories/purchase-payment.repository";
import * as ProductRepository from "../repositories/product.repository";
import { AppDataSource } from "../infra/config/data-source";
import { Purchase } from "../infra/entities/purchase.entity";
import { PurchaseItem } from "../infra/entities/purchase-item.entity";
import { PurchasePayment } from "../infra/entities/purchase-payment.entity";
import { Supplier } from "../infra/entities/supplier.entity";
import { toPurchaseResponseDto, toPurchaseResponseDtoList } from "../dtos/purchase.dto";
import { getSupplierById } from "../repositories/supplier.repository";
import { getProductById } from "./product.service";

type CreatePurchaseDto = any;
type UpdatePurchaseDto = any;

async function getAllPurchases(filters: any = {}) {
    const [list, total] = await PurchaseRepository.getAllPurchases(filters);
    return [toPurchaseResponseDtoList(list), total];
}

async function getPurchaseById(id: number) {
    const purchase = await PurchaseRepository.getPurchaseById(id);
    if (!purchase) throw new NotFoundError("Purchase not found");

    // load items and payments
    const items = await ItemRepository.getItemsByPurchaseId(id, true);
    const payments = await PaymentRepository.getPaymentsByPurchaseId(id, true);

    // attach for convenience
    (purchase as any).items = items;
    (purchase as any).payments = payments;

    return toPurchaseResponseDto(purchase);
}

async function createPurchase(data: CreatePurchaseDto) {
    await validatePurchaseData(data);

    return await AppDataSource.manager.transaction(async (manager) => {
        
        const supplier = await getSupplierById(data.supplierId);

        const purchase = new Purchase({
            total: data.total,
            estimated_delivery_date: data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : undefined,
            purchase_date: new Date(data.purchaseDate),
            supplier: supplier!,
            nf_number: data.nfNumber,
            nf_serie: data.nfSerie,
            used_nf_xml_document: data.usedNfXmlDocument ?? false,
            internal_notes: data.internalNotes,
        });

        const savedPurchase = await manager.save(purchase);

        // payments
        if (Array.isArray(data.payments)) {
            for (const p of data.payments) {
                const payment = new PurchasePayment({
                    total: p.total,
                    payment_method: p.paymentMethod,
                    purchase: savedPurchase,
                });
                await manager.save(payment);
            }
        }

        // products/items
        if (Array.isArray(data.products)) {
            for (const it of data.products) {
                const product = await ProductRepository.getProductById(it.productId);
                if (!product) throw new NotFoundError("Product not found");

                const item = new PurchaseItem({
                    product,
                    quantity: it.quantity,
                    unit_price: it.unitPrice,
                    total: it.total,
                    purchase: savedPurchase,
                });
                await manager.save(item);
            }
        }

        return toPurchaseResponseDto(savedPurchase);
    });
}

async function updatePurchase(id: number, data: UpdatePurchaseDto) {

    await validatePurchaseData(data);

    return await AppDataSource.manager.transaction(async (manager) => {
        const existing = await PurchaseRepository.getPurchaseById(id);
        if (!existing) throw new NotFoundError("Purchase not found");

        if (data.total !== undefined) existing.total = data.total;
        if (data.estimatedDeliveryDate !== undefined) existing.estimated_delivery_date = data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : undefined;
        if (data.purchaseDate !== undefined) existing.purchase_date = new Date(data.purchaseDate);
        if (data.nfNumber !== undefined) existing.nf_number = data.nfNumber;
        if (data.nfSerie !== undefined) existing.nf_serie = data.nfSerie;
        if (data.usedNfXmlDocument !== undefined) existing.used_nf_xml_document = data.usedNfXmlDocument;
        if (data.internalNotes !== undefined) existing.internal_notes = data.internalNotes;

        if (data.supplierId !== undefined) {
            const supplier = await SupplierRepository.getSupplierById(data.supplierId);
            if (supplier) existing.supplier = supplier;
        }

        const savedPurchase = await manager.save(existing);

        // payments handling
        if (Array.isArray(data.payments)) {
            const existingPayments = await manager.find(PurchasePayment, { where: { purchase: { id } }, withDeleted: true });
            const existingMap: Record<number, PurchasePayment> = {};
            for (const ep of existingPayments) existingMap[ep.id] = ep;

            const incomingIds: number[] = [];
            for (const p of data.payments) {
                if (p.id) {
                    incomingIds.push(p.id);
                    const found = existingMap[p.id];
                    if (found) {
                        found.total = p.total;
                        found.payment_method = p.paymentMethod;
                        await manager.save(found);
                    }
                } else {
                    const payment = new PurchasePayment({ total: p.total, payment_method: p.paymentMethod, purchase: savedPurchase });
                    await manager.save(payment);
                }
            }

            // remove payments not present
            for (const ep of existingPayments) {
                if (!incomingIds.includes(ep.id)) {
                    await manager.softRemove(ep);
                }
            }
        }

        // products/items handling
        if (Array.isArray(data.products)) {
            const existingItems = await manager.find(PurchaseItem, { where: { purchase: { id } }, withDeleted: true });
            const existingMap: Record<number, PurchaseItem> = {};
            for (const ei of existingItems) existingMap[ei.id] = ei;

            const incomingIds: number[] = [];
            for (const it of data.products) {
                if (it.id) {
                    incomingIds.push(it.id);
                    const found = existingMap[it.id];
                    if (found) {
                        found.quantity = it.quantity;
                        found.unit_price = it.unitPrice;
                        found.total = it.total;
                        await manager.save(found);
                    }
                } else {
                    const product = await ProductRepository.getProductById(it.productId);
                    if (!product) throw new NotFoundError("Product not found");
                    const item = new PurchaseItem({ product, quantity: it.quantity, unit_price: it.unitPrice, total: it.total, purchase: savedPurchase });
                    await manager.save(item);
                }
            }

            for (const ei of existingItems) {
                if (!incomingIds.includes(ei.id)) {
                    await manager.softRemove(ei);
                }
            }
        }

        return toPurchaseResponseDto(savedPurchase);
    });
}

async function deletePurchase(id: number) {
    const purchase = await PurchaseRepository.getPurchaseById(id, true);
    if (!purchase) throw new NotFoundError("Purchase not found");
    if (purchase.deleted_at) return true;
    await PurchaseRepository.deletePurchase(purchase);
    return true;
}

async function restorePurchase(id: number) {
    const purchase = await PurchaseRepository.getPurchaseById(id, true);
    if (!purchase) throw new NotFoundError("Purchase not found");
    if (!purchase.deleted_at) throw new BadRequestError("Purchase is not deleted");
    await PurchaseRepository.restorePurchase(purchase);
    const restored = await PurchaseRepository.getPurchaseById(id, true);
    return toPurchaseResponseDto(restored!);
}

async function validatePurchaseData(data: CreatePurchaseDto | UpdatePurchaseDto) {
    console.log("Validating purchase data:", data);
    if (data.supplierId) {
        const supplier = await SupplierRepository.getSupplierById(data.supplierId);
        if (!supplier) throw new NotFoundError("Supplier not found");
    }

    if (data.estimatedDeliveryDate && isNaN(Date.parse(data.estimatedDeliveryDate))) {
        throw new BadRequestError("Invalid estimatedDeliveryDate");
    }

    if (data.purchaseDate && isNaN(Date.parse(data.purchaseDate))) {
        throw new BadRequestError("Invalid purchaseDate");
    }

    if (data.products && !Array.isArray(data.products)) {
        throw new BadRequestError("Invalid products format");
    }

    if (data.payments && !Array.isArray(data.payments)) {
        throw new BadRequestError("Invalid payments format");
    }

    if (data.estimatedDeliveryDate && data.purchaseDate) {
        const estDate = new Date(data.estimatedDeliveryDate);
        const purDate = new Date(data.purchaseDate);
        if (estDate < purDate) {
            throw new BadRequestError("Estimated delivery date cannot be before purchase date");
        }
    }

    if (Array.isArray(data.payments)) {
        for (const p of data.payments) {
            if (p.total <= 0) {
                throw new BadRequestError("Payment total must be positive");
            }
            if (!["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "PIX"].includes(p.paymentMethod)) {
                throw new BadRequestError("Invalid payment method");
            }
        }
    }
    
    if (Array.isArray(data.products)) {
        for (const p of data.products) {
            if (p.productId <= 0) {
                throw new BadRequestError("Invalid productId");
            }

            const product = await ProductRepository.getProductById(p.productId);
            if (!product) throw new NotFoundError("Product not found");

            if (p.quantity <= 0) {
                throw new BadRequestError("Product quantity must be positive");
            }
            if (p.unitPrice <= 0) {
                throw new BadRequestError("Product unit price must be positive");
            }
            if (p.total <= 0) {
                throw new BadRequestError("Product total must be positive");
            }
        }
    }

    if (data.products && data.payments && data.total !== undefined) {
        const totalProducts = data.products.reduce((sum: number, p: any) => sum + p.total, 0);
        const totalPayments = data.payments.reduce((sum: number, p: any) => sum + p.total, 0);

        if (data.total !== totalProducts || data.total !== totalPayments) {
            throw new BadRequestError("Total must match sum of product totals");
        }

        if (totalProducts !== totalPayments) {
            throw new BadRequestError("Total of products must match total of payments");
        }
    }
}
export { getAllPurchases, getPurchaseById, createPurchase, updatePurchase, deletePurchase, restorePurchase };
