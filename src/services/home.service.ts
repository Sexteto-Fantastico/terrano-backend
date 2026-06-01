import * as PurchaseRepository from "../repositories/purchase.repository";
import * as MovementRepository from "../repositories/movement.repository";
import { MovementType } from "../infra/entities/movement.entity";
import { HomeResponse, toHomeResponse } from "../dtos/home.dto";
import { formatDateToYYYYMMDD, formatDateToStartOfDay } from "../utils/date.util";

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

    const previousMonthStartStr = formatDateToYYYYMMDD(previousMonthStart);
    const currentMonthStartStr = formatDateToYYYYMMDD(currentMonthStart);
    const nextMonthStartStr = formatDateToYYYYMMDD(nextMonthStart);

    const previousMonthStartDateTimeStr = formatDateToStartOfDay(previousMonthStart);
    const currentMonthStartDateTimeStr = formatDateToStartOfDay(currentMonthStart);
    const nextMonthStartDateTimeStr = formatDateToStartOfDay(nextMonthStart);

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
        PurchaseRepository.getPurchasesTotalByDateRange(currentMonthStartStr, nextMonthStartStr),
        PurchaseRepository.getPurchasesTotalByDateRange(previousMonthStartStr, currentMonthStartStr),
        MovementRepository.getGrandTotalQuantity(MovementType.IN),
        MovementRepository.getTotalQuantityByDateRange(MovementType.IN, currentMonthStartDateTimeStr, nextMonthStartDateTimeStr),
        MovementRepository.getTotalQuantityByDateRange(MovementType.IN, previousMonthStartDateTimeStr, currentMonthStartDateTimeStr),
        MovementRepository.getGrandTotalQuantity(MovementType.OUT),
        MovementRepository.getTotalQuantityByDateRange(MovementType.OUT, currentMonthStartDateTimeStr, nextMonthStartDateTimeStr),
        MovementRepository.getTotalQuantityByDateRange(MovementType.OUT, previousMonthStartDateTimeStr, currentMonthStartDateTimeStr)
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