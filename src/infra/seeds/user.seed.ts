import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Department } from "../entities/department.entity";
import { hashPassword } from "../../utils/password.util";

export async function createUserSeed(): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);
    const departmentRepository = AppDataSource.getRepository(Department);

    const employeeRole = await roleRepository.findOne({
        where: {
            name: "EMPLOYEE",
        },
    });

    if (!employeeRole) {
        throw new Error("EMPLOYEE role not found");
    }

    const departments = await departmentRepository.find();

    const users = [
        {
            name: "João Silva",
            email: "joao.silva@terrano.com",
            username: "jsilva",
        },
        {
            name: "Maria Souza",
            email: "maria.souza@terrano.com",
            username: "msouza",
        },
        {
            name: "Carlos Santos",
            email: "carlos.santos@terrano.com",
            username: "csantos",
        },
        {
            name: "Ana Lima",
            email: "ana.lima@terrano.com",
            username: "alima",
        },
    ];

    for (let i = 0; i < users.length; i++) {
        const userData = users[i];

        const exists = await userRepository.findOne({
            where: {
                email: userData.email,
            },
        });

        if (exists) continue;

        await userRepository.save(
            userRepository.create({
                ...userData,
                password: hashPassword("123456"),
                role: employeeRole,
                department: departments[i % departments.length],
                is_active: true,
            })
        );
    }

    console.log("User seed completed");
}