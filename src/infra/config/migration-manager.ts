import { AppDataSource } from "./data-source";
import { ensureDatabaseExists } from "./ensure-database";

export async function migrateDatabase(): Promise<void> {
    await ensureDatabaseExists();
    await AppDataSource.initialize();

    console.log("Database connected successfully");
    console.log("Running migrations...");
    await AppDataSource.runMigrations();
    console.log("Migrations executed successfully");
}
