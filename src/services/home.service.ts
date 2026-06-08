import * as PurchaseRepository from "../repositories/purchase.repository";
import * as MovementRepository from "../repositories/movement.repository";
import { MovementType } from "../infra/entities/movement.entity";
import { HomeResponse, toHomeResponse } from "../dtos/home.dto";
import { getStartOfDay } from "../utils/date.util";

function calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    const percentage = ((current - previous) / previous) * 100;
    return Number(percentage.toFixed(1));
}

async function getHomeSummary(): Promise<HomeResponse> {
    const now = new Date();

    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const previousMonthStartDateTime = getStartOfDay(previousMonthStart);
    const currentMonthStartDateTime = getStartOfDay(currentMonthStart);
    const nextMonthStartDateTime = getStartOfDay(nextMonthStart);

    const [
        purchasesGrandTotal,
        purchasesCurrentMonth,
        purchasesPreviousMonth,
        entriesGrandTotal,
        entriesCurrentMonth,
        entriesPreviousMonth,
        exitsGrandTotal,
        exitsCurrentMonth,
        exitsPreviousMonth
    ] = await Promise.all([
        PurchaseRepository.getGrandTotalPurchases(),
        PurchaseRepository.getPurchasesTotalByDateRange(currentMonthStartDateTime, nextMonthStartDateTime),
        PurchaseRepository.getPurchasesTotalByDateRange(previousMonthStartDateTime, currentMonthStartDateTime),
        MovementRepository.getGrandTotalQuantity(MovementType.IN),
        MovementRepository.getTotalQuantityByDateRange(MovementType.IN, currentMonthStartDateTime, nextMonthStartDateTime),
        MovementRepository.getTotalQuantityByDateRange(MovementType.IN, previousMonthStartDateTime, currentMonthStartDateTime),
        MovementRepository.getGrandTotalQuantity(MovementType.OUT),
        MovementRepository.getTotalQuantityByDateRange(MovementType.OUT, currentMonthStartDateTime, nextMonthStartDateTime),
        MovementRepository.getTotalQuantityByDateRange(MovementType.OUT, previousMonthStartDateTime, currentMonthStartDateTime)
    ]);

    return toHomeResponse({
        purchases: {
            total: purchasesGrandTotal,
            percentage: calculatePercentageChange(purchasesCurrentMonth, purchasesPreviousMonth),
        },
        entries: {
            total: entriesGrandTotal,
            percentage: calculatePercentageChange(entriesCurrentMonth, entriesPreviousMonth),
        },
        exits: {
            total: exitsGrandTotal,
            percentage: calculatePercentageChange(exitsCurrentMonth, exitsPreviousMonth),
        },
        alerts: {
            total: 0,
            newCount: 0,
        },
    });

}

export { getHomeSummary };