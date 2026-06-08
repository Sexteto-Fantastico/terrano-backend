import { AppDataSource } from "../infra/config/data-source";
import { Purchase } from "../infra/entities/purchase.entity";

const purchaseRepository = AppDataSource.getRepository(Purchase);

async function getPurchaseById(id: number, withDeleted = false): Promise<Purchase | null> {
    return purchaseRepository.findOne({ where: { id }, relations: ["supplier"], withDeleted });
}

async function savePurchase(purchase: Purchase): Promise<Purchase> {
    return await purchaseRepository.save(purchase);
}

async function deletePurchase(purchase: Purchase): Promise<boolean> {
    const result = await purchaseRepository.softRemove(purchase);
    return !!result;
}

async function restorePurchase(purchase: Purchase): Promise<Purchase> {
    return await purchaseRepository.recover(purchase);
}

async function getAllPurchases(filters: any = {}): Promise<[Purchase[], number]> {
    const {
        pageIndex,
        pageSize,
        activeOnly = true,
        supplierId,
        purchaseDate,
        estimatedDeliveryDate,
        nfNumber,
        nfSerie,
    } = filters;

    const qb = purchaseRepository.createQueryBuilder("purchase")
        .leftJoinAndSelect("purchase.supplier", "supplier")
        .orderBy("purchase.purchase_date", "DESC");

    if (!activeOnly) {
        qb.withDeleted();
    }

    if (supplierId !== undefined) {
        qb.andWhere("purchase.supplier_id = :supplierId", { supplierId });
    }
    if (purchaseDate !== undefined) {
        qb.andWhere("purchase.purchase_date = :purchaseDate", { purchaseDate });
    }
    if (estimatedDeliveryDate !== undefined) {
        qb.andWhere("purchase.estimated_delivery_date = :estimatedDeliveryDate", { estimatedDeliveryDate });
    }
    if (nfNumber !== undefined) {
        qb.andWhere("purchase.nf_number = :nfNumber", { nfNumber });
    }
    if (nfSerie !== undefined) {
        qb.andWhere("purchase.nf_serie = :nfSerie", { nfSerie });
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        qb.take(pageSize);
        qb.skip((pageIndex - 1) * pageSize);
    }

    return await qb.getManyAndCount();
}

async function getGrandTotalPurchases(): Promise<number> {
    const result = await purchaseRepository
        .createQueryBuilder("purchase")
        .select("SUM(purchase.total)", "total")
        .getRawOne();
    return Number(result?.total || 0);
}

async function getPurchasesTotalByDateRange(startDate: string | Date, endDate: string | Date): Promise<number> {
    const result = await purchaseRepository
        .createQueryBuilder("purchase")
        .select("SUM(purchase.total)", "total")
        .where("purchase.purchase_date >= :startDate", { startDate })
        .andWhere("purchase.purchase_date < :endDate", { endDate })
        .getRawOne();
    return Number(result?.total || 0);
}

export {
    getPurchaseById,
    savePurchase,
    deletePurchase,
    restorePurchase,
    getAllPurchases,
    getGrandTotalPurchases,
    getPurchasesTotalByDateRange,
};
