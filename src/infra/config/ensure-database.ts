import mysql from "mysql2/promise";

export async function ensureDatabaseExists(): Promise<void> {
    const dbName = process.env.DB_NAME || "terrano";

    let retries = 10;

    while (retries) {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || "localhost",
                port: Number(process.env.DB_PORT) || 3306,
                user: process.env.DB_USER || "root",
                password: process.env.DB_PASS || "",
            });

            await connection.query(
                `CREATE DATABASE IF NOT EXISTS \`${dbName}\``
            );

            console.log(`Database "${dbName}" is ready`);
            await connection.end();
            return;
        } catch (err) {
            console.log("Waiting for database");
            retries--;
            await new Promise(res => setTimeout(res, 3000));
        }
    }

    throw new Error("Could not connect to database after retries");
}