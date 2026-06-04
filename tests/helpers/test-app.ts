import express from "express";
import departmentRoutes from "../../src/routes/department.routes";
import { globalErrorMiddleware } from "../../src/middlewares/global-error.middleware";
//import { paginationMiddleware } from "../../src/middlewares/pagination.middleware";

export function createTestApp() {
    const app = express();

    app.use(express.json());
  //  app.use(paginationMiddleware);

    app.use("/departments", departmentRoutes);

    app.use(globalErrorMiddleware);

    return app;
}