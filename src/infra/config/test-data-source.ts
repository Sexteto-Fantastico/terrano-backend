import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

export const TestDataSource = new DataSource({
    type: "sqlite",

    database: ":memory:",

    synchronize: true,

    dropSchema: true,

    logging: false,

  entities: [
    __dirname + "/../entities/*.entity.{ts,js}"
]
});