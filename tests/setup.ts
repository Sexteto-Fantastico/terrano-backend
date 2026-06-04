import dotenv from "dotenv";

dotenv.config({
    path: ".env.test"
});

import { AppDataSource } from "../src/infra/config/data-source";
import { TestDataSource } from "../src/infra/config/test-data-source";

beforeAll(async () => {

    if (!TestDataSource.isInitialized) {
        await TestDataSource.initialize();
    }

    Object.assign(AppDataSource, TestDataSource);
});

beforeEach(async () => {
    await TestDataSource.synchronize(true);
});

afterAll(async () => {

    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
});