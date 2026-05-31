import { AppDataSource } from "../config/data-source";
import {
    StockRequisition,
    RequisitionStatus,
} from "../entities/stock-requisition.entity";
import { Department } from "../entities/department.entity";

export async function createStockRequisitionSeed(): Promise<void> {

    const repository =
        AppDataSource.getRepository(StockRequisition);

    const departments =
        await AppDataSource
            .getRepository(Department)
            .find();

    if (!departments.length) {
        throw new Error("No departments found");
    }

    const statuses = [
        RequisitionStatus.PENDING,
        RequisitionStatus.APPROVED,
        RequisitionStatus.COMPLETED,
        RequisitionStatus.REJECTED,
    ];

    for (let i = 1; i <= 20; i++) {

        const companyName =
            `Terrano Obra ${i}`;

        const exists =
            await repository.findOne({
                where: {
                    company_name: companyName,
                },
            });

        if (exists) continue;

        const department =
            departments[
                Math.floor(Math.random() * departments.length)
            ];

        const declaredAt = new Date();

        declaredAt.setDate(
            declaredAt.getDate() -
            Math.floor(Math.random() * 90)
        );

        await repository.save(
            repository.create({
                company_name: companyName,
                status:
                    statuses[
                        Math.floor(Math.random() * statuses.length)
                    ],
                department,
                declared_at: declaredAt,
                total_value: 0,
            })
        );
    }

    console.log("StockRequisition seed completed");
}