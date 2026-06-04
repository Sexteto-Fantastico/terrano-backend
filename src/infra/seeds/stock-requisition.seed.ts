import { AppDataSource } from "../config/data-source";
import {
    StockRequisition,
    RequisitionStatus,
} from "../entities/stock-requisition.entity";

export async function createStockRequisitionSeed(): Promise<void> {

    const repository =
        AppDataSource.getRepository(StockRequisition);

    const statuses = [
        RequisitionStatus.PENDING,
        RequisitionStatus.APPROVED,
        RequisitionStatus.FINISHED,
        RequisitionStatus.DENIED,
    ];

    for (let i = 1; i <= 20; i++) {

        const justification =
            `Material request ${i}`;

        const exists =
            await repository.findOne({
                where: {
                    requester_justification: justification,
                },
            });

        if (exists) {
            continue;
        }

        await repository.save(
            repository.create({
                requester_justification: justification,
                status:
                    statuses[
                        Math.floor(
                            Math.random() * statuses.length
                        )
                    ],
            })
        );
    }

    console.log("StockRequisition seed completed");
}