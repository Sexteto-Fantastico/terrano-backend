import { AppDataSource } from "../config/data-source";
import { Address } from "../entities/address.entity";
import { Supplier } from "../entities/supplier.entity";

export async function createAddressSeed(): Promise<void> {
    const addressRepository = AppDataSource.getRepository(Address);
    const supplierRepository = AppDataSource.getRepository(Supplier);

    const suppliers = await supplierRepository.find();

    const addresses = [
        {
            supplierCnpj: "11111111000101",
            street: "Av. Paulista",
            number: "1000",
            neighborhood: "Bela Vista",
            city: "São Paulo",
            state: "SP",
            country: "Brasil",
            complement: "10º Andar",
        },
        {
            supplierCnpj: "22222222000102",
            street: "Rua das Flores",
            number: "200",
            neighborhood: "Centro",
            city: "Porto Alegre",
            state: "RS",
            country: "Brasil",
        },
        {
            supplierCnpj: "33333333000103",
            street: "Av. Tecnológica",
            number: "300",
            neighborhood: "Distrito Industrial",
            city: "Florianópolis",
            state: "SC",
            country: "Brasil",
        },
    ];

    for (const addressData of addresses) {
        const supplier = suppliers.find(
            s => s.cnpj === addressData.supplierCnpj
        );

        if (!supplier) {
            console.warn(
                `Supplier ${addressData.supplierCnpj} not found`
            );
            continue;
        }

        const exists = await addressRepository.findOne({
            where: {
                supplier: {
                    id: supplier.id,
                },
            },
            relations: {
                supplier: true,
            },
        });

        if (exists) continue;

        const address = addressRepository.create({
            street: addressData.street,
            number: addressData.number,
            neighborhood: addressData.neighborhood,
            city: addressData.city,
            state: addressData.state,
            country: addressData.country,
            complement: addressData.complement,
            supplier,
        });

        await addressRepository.save(address);
    }

    console.log("Address seed completed");
}