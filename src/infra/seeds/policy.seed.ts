import { AppDataSource } from "../config/data-source";
import { Policy } from "../entities/policy.entity";

export async function createPolicySeed(): Promise<void> {
    const repository = AppDataSource.getRepository(Policy);

    const policies = [
        {
            name: "USER_CREATE",
            description: "Criar usuários",
            resource: "USER",
            action: "CREATE",
        },
        {
            name: "USER_READ",
            description: "Visualizar usuários",
            resource: "USER",
            action: "READ",
        },
        {
            name: "USER_UPDATE",
            description: "Editar usuários",
            resource: "USER",
            action: "UPDATE",
        },
        {
            name: "USER_DELETE",
            description: "Excluir usuários",
            resource: "USER",
            action: "DELETE",
        },
        {
            name: "PRODUCT_CREATE",
            description: "Criar produtos",
            resource: "PRODUCT",
            action: "CREATE",
        },
        {
            name: "PRODUCT_READ",
            description: "Visualizar produtos",
            resource: "PRODUCT",
            action: "READ",
        },
        {
            name: "PRODUCT_UPDATE",
            description: "Editar produtos",
            resource: "PRODUCT",
            action: "UPDATE",
        },
        {
            name: "PRODUCT_DELETE",
            description: "Excluir produtos",
            resource: "PRODUCT",
            action: "DELETE",
        },
        {
            name: "STOCK_VIEW",
            description: "Visualizar estoque",
            resource: "STOCK",
            action: "READ",
        },
        {
            name: "STOCK_MOVEMENT",
            description: "Movimentar estoque",
            resource: "STOCK",
            action: "MOVE",
        },
    ];

    for (const policyData of policies) {
        const exists = await repository.findOne({
            where: {
                name: policyData.name,
            },
        });

        if (exists) {
            continue;
        }

        const policy = repository.create(policyData);

        await repository.save(policy);
    }

    console.log("Policy seed completed");
}