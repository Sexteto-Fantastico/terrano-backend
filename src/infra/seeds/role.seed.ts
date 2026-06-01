import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/role.entity";

export async function createRoleSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(Role);

    const roles = [
        {
            name: "ADMIN",
            description: "Administrador do sistema",
        },
        {
            name: "MANAGER",
            description: "Gestor",
        },
        {
            name: "WAREHOUSE",
            description: "Almoxarife",
        },
        {
            name: "PURCHASING",
            description: "Comprador",
        },
        {
            name: "EMPLOYEE",
            description: "Colaborador",
        },
    ];

    for (const roleData of roles) {
        const exists = await repository.findOne({
            where: {
                name: roleData.name,
            },
        });

        if (exists) {
            continue;
        }

        const role = repository.create(roleData);

        await repository.save(role);
    }

    console.log("Role seed completed");
}