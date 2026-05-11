import { AppDataSource } from "./data-source";
import { createAdminSeed } from "../seeds/admin.seed";

export async function migrateDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();

        console.log("Database connected successfully");
        console.log("Running migrations...");

        await AppDataSource.runMigrations();

        console.log("Migrations executed successfully");

        await createAdminSeed();
    } catch (err) {
        console.error("Migration error:", err);
        throw err;
    }
}