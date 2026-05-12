import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import productCategoryRoutes from "./routes/product-category.routes";
import productBrandRoutes from "./routes/product-brand.routes";
import productRoutes from "./routes/product.routes";
import departmentRoutes from "./routes/department.routes";
import stockLocationRoutes from "./routes/stock-location.routes";
import measurementUnitRoutes from "./routes/measurement-unit.routes";
import { migrateDatabase } from "./infra/config/migration-manager";
import { setupSwagger } from "./infra/config/swagger";
import { Endpoints } from "./utils/constants/endpoints";
import { globalErrorMiddleware } from "./middlewares/global-error.middleware";
import { requestContextMiddleware } from "./utils/request-context";
import { paginationMiddleware } from "./middlewares/pagination.middleware";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
    exposedHeaders: ["X-Total-Count", "X-Total-Pages", "X-Page", "X-Limit"],
}));
app.use(express.json());
app.use(paginationMiddleware);

setupSwagger(app);
app.use(requestContextMiddleware);

app.use(Endpoints.AUTH.BASE, authRoutes);
app.use(authMiddleware);

app.use(Endpoints.USERS.BASE, userRoutes);
app.use(Endpoints.PRODUCT_CATEGORIES.BASE, productCategoryRoutes);
app.use(Endpoints.PRODUCT_BRANDS.BASE, productBrandRoutes);
app.use(Endpoints.PRODUCTS.BASE, productRoutes);
app.use(Endpoints.DEPARTMENTS.BASE, departmentRoutes);
app.use(Endpoints.STOCK_LOCATIONS.BASE, stockLocationRoutes);
app.use(Endpoints.MEASUREMENT_UNITS.BASE, measurementUnitRoutes);


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