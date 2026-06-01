import { AppDataSource } from "../config/data-source";
import { Supplier } from "../entities/supplier.entity";

export async function createSupplierSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(Supplier);

    const suppliers = [
        {
            corporate_name: "Bosch Ferramentas Ltda",
            trade_name: "Bosch",
            cnpj: "11111111000101",
            email: "contato@bosch.com.br",
            phone: "11999990001",
        },
        {
            corporate_name: "Makita do Brasil Ltda",
            trade_name: "Makita",
            cnpj: "11111111000102",
            email: "contato@makita.com.br",
            phone: "11999990002",
        },
        {
            corporate_name: "3M do Brasil Ltda",
            trade_name: "3M",
            cnpj: "11111111000103",
            email: "contato@3m.com.br",
            phone: "11999990003",
        },
        {
            corporate_name: "Intelbras S.A.",
            trade_name: "Intelbras",
            cnpj: "11111111000104",
            email: "contato@intelbras.com.br",
            phone: "11999990004",
        },
        {
            corporate_name: "Tigre S.A.",
            trade_name: "Tigre",
            cnpj: "11111111000105",
            email: "contato@tigre.com.br",
            phone: "11999990005",
        },
        {
            corporate_name: "Amanco Wavin Ltda",
            trade_name: "Amanco",
            cnpj: "11111111000106",
            email: "contato@amanco.com.br",
            phone: "11999990006",
        },
        {
            corporate_name: "Legrand Brasil Ltda",
            trade_name: "Legrand",
            cnpj: "11111111000107",
            email: "contato@legrand.com.br",
            phone: "11999990007",
        },
        {
            corporate_name: "Schneider Electric Brasil",
            trade_name: "Schneider Electric",
            cnpj: "11111111000108",
            email: "contato@schneider.com.br",
            phone: "11999990008",
        },
        {
            corporate_name: "Furukawa Electric LatAm",
            trade_name: "Furukawa",
            cnpj: "11111111000109",
            email: "contato@furukawa.com.br",
            phone: "11999990009",
        },
        {
            corporate_name: "Tramontina S.A.",
            trade_name: "Tramontina",
            cnpj: "11111111000110",
            email: "contato@tramontina.com.br",
            phone: "11999990010",
        },
    ];

    for (const supplierData of suppliers) {
        const exists = await repository.findOne({
            where: {
                cnpj: supplierData.cnpj,
            },
        });

        if (exists) continue;

        await repository.save(
            repository.create(supplierData)
        );
    }

    console.log("Supplier seed completed");
}