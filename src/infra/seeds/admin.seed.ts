import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { hashPassword } from "../../utils/password.util";

const isProduction = process.env.NODE_ENV === "production";

export async function createAdminSeed(): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@terrano.com";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";

    const adminRole = await roleRepository.findOne({
        where: {
            name: "ADMIN",
        },
    });

    if (!adminRole) {
        throw new Error("ADMIN role not found");
    }

    const existingAdmin = await userRepository.findOne({
        where: isProduction
            ? [{ role: { id: adminRole.id } }]
            : [{ email: adminEmail }, { username: adminUsername }],
        withDeleted: true,
    });

    if (existingAdmin) {
        console.log("Admin user already exists");
        return;
    }

    // Production never gets a well-known password: it must be provided and is replaced on first login.
    const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? undefined : "admin123");
    if (!adminPassword) {
        console.warn("ADMIN_PASSWORD is not set: skipping the initial admin creation.");
        return;
    }

    const admin = userRepository.create({
        name: "System Admin",
        email: adminEmail,
        username: adminUsername,
        password: await hashPassword(adminPassword),
        requires_password_reset: isProduction,
        role: adminRole,
    });

    await userRepository.save(admin);

    console.log("Admin user created successfully");
}
