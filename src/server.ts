import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import productCategoryRoutes from "./routes/product-category.routes";
import productBrandRoutes from "./routes/product-brand.routes";
import productRoutes from "./routes/product.routes";
import departmentRoutes from "./routes/department.routes";
import { migrateDatabase } from "./infra/config/migration-manager";
import { setupSwagger } from "./infra/config/swagger";
import { Endpoints } from "./utils/constants/endpoints";
import { globalErrorMiddleware } from "./middlewares/global-error.middleware";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use(Endpoints.USERS.BASE, userRoutes);
app.use(Endpoints.PRODUCT_CATEGORIES.BASE, productCategoryRoutes);
app.use(Endpoints.PRODUCT_BRANDS.BASE, productBrandRoutes);
app.use(Endpoints.PRODUCTS.BASE, productRoutes);
app.use(Endpoints.DEPARTMENTS.BASE, departmentRoutes);

app.use(globalErrorMiddleware);

migrateDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
