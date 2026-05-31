import { AppDataSource } from "../config/data-source";
import { Purchase } from "../entities/purchase.entity";
import { Supplier } from "../entities/supplier.entity";

export async function createPurchaseSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(Purchase);

    const suppliers = await AppDataSource
        .getRepository(Supplier)
        .find();

    if (!suppliers.length) {
        throw new Error("No suppliers found");
    }

    for (let i = 1; i <= 20; i++) {

        const nfNumber = `NF-${1000 + i}`;

        const exists = await repository.findOne({
            where: {
                nf_number: nfNumber,
            },
        });

        if (exists) continue;

        const supplier =
            suppliers[Math.floor(Math.random() * suppliers.length)];

        const purchaseDate = new Date();

        purchaseDate.setDate(
            purchaseDate.getDate() - Math.floor(Math.random() * 180)
        );

        const estimatedDelivery = new Date(purchaseDate);

        estimatedDelivery.setDate(
            estimatedDelivery.getDate() + Math.floor(Math.random() * 15)
        );

        await repository.save(
            repository.create({
                nf_number: nfNumber,
                nf_serie: "1",
                supplier,
                purchase_date: purchaseDate,
                estimated_delivery_date: estimatedDelivery,
                used_nf_xml_document: false,
                internal_notes: `Compra seed ${i}`,
                total: 0,
            })
        );
    }

    console.log("Purchase seed completed");
}