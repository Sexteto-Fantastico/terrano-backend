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

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);

// Set up Swagger API documentation
setupSwagger(app);

ensureDatabaseExists()
    .then(() => AppDataSource.initialize())
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
