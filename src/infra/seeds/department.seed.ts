import { AppDataSource } from "../config/data-source";
import { Department } from "../entities/department.entity";

export async function createDepartmentSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(Department);

    const departments = [
        { name: "Compras" },
        { name: "Almoxarifado" },
        { name: "Manutenção" },
        { name: "Produção" },
        { name: "TI" },
        { name: "RH" },
        { name: "Financeiro" },
        { name: "Engenharia" },
    ];

    for (const departmentData of departments) {
        const exists = await repository.findOne({
            where: {
                name: departmentData.name,
            },
        });

        if (exists) continue;

        await repository.save(
            repository.create({
                ...departmentData,
                is_active: true,
            })
        );
    }

    console.log("Department seed completed");
}