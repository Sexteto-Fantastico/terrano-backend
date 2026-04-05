import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import { AppDataSource } from "./config/data-source";
import { ensureDatabaseExists } from "./config/ensure-database";
import { setupSwagger } from "./config/swagger";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

import productCategoryRoutes from "./routes/product-category.routes";

import { Endpoints } from "./utils/constants/endpoints";
import { globalErrorMiddleware } from "./middlewares/global-error.middleware";
import { setupProductRoutes } from "./routes/product.routes";

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use(Endpoints.USERS.BASE, userRoutes);
app.use(Endpoints.PRODUCT_CATEGORIES.BASE, productCategoryRoutes);
app.use(Endpoints.PRODUCTS.BASE, setupProductRoutes());

app.use(globalErrorMiddleware);

ensureDatabaseExists()
    .then(() => AppDataSource.initialize())
    .then(async () => {
        console.log("Database connected successfully");

        console.log("Running migrations...");
        await AppDataSource.runMigrations();
        console.log("Migrations executed successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
