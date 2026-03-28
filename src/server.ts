import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import { ensureDatabaseExists } from "./config/ensure-database";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

import productCategoryRoutes from "./routes/product-category.routes";
import { Endpoints } from "./utils/constants/endpoints";

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Terrano API is running" });
});

app.use(Endpoints.PRODUCT_CATEGORIES.BASE, productCategoryRoutes);

ensureDatabaseExists()
    .then(() => AppDataSource.initialize())
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
