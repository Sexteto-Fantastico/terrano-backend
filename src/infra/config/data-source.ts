import "dotenv/config";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [
        __dirname + "/../**/*.entity{.ts,.js}"
    ],
    migrations: [
        __dirname + "/../migrations/*{.ts,.js}"
    ],
    subscribers: [
        __dirname + "/../subscribers/*{.ts,.js}"
    ],
});