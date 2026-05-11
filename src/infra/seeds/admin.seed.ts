import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";

export async function createAdminSeed(): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);

    const adminEmail = "admin@terrano.com";
    const adminUsername = "admin";

    const existingAdmin = await userRepository.findOne({
        where: [{ email: adminEmail }, { username: adminUsername }]
    });

    if (existingAdmin) {
        console.log("Admin user already exists");
        return;
    }

    const passwordHash = await bcrypt.hash("admin", 10);

    const admin = userRepository.create({
        name: "System Admin",
        email: adminEmail,
        username: adminUsername,
        password: passwordHash,
        is_active: true,
        requires_password_reset: false,
    });

    await userRepository.save(admin);

    console.log("Admin user created successfully");
}