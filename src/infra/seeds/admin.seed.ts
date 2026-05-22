import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { hashPassword } from "../../utils/password.util";

export async function createAdminSeed(): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    const adminEmail = "admin@terrano.com";
    const adminUsername = "admin";

    const existingAdmin = await userRepository.findOne({
        where: [
            { email: adminEmail },
            { username: adminUsername }
        ]
    });

    if (existingAdmin) {
        console.log("Admin user already exists");
        return;
    }

    const adminRole = await roleRepository.findOne({
        where: {
            name: "ADMIN",
        },
    });

    if (!adminRole) {
        throw new Error("ADMIN role not found");
    }

    const passwordHash = hashPassword("admin123")

    const admin = userRepository.create({
        name: "System Admin",
        email: adminEmail,
        username: adminUsername,
        password: passwordHash,
        is_active: true,
        requires_password_reset: false,
        role: adminRole,
    });

    await userRepository.save(admin);

    console.log("Admin user created successfully");
}