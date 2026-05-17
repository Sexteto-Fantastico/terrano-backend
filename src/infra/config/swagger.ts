import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { registry } from "./openapi";

export const setupSwagger = (app: Application) => {
    const generator = new OpenApiGeneratorV3(registry.definitions);

    const swaggerSpec = generator.generateDocument({
        openapi: "3.0.0",
        info: {
            title: "Terrano API",
            version: "1.0.0",
            description: "API documentation for the Terrano backend system",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Local Development Server",
            },
        ],
        security: [
            {
                bearerAuth: [],
            },
        ],
    });

    swaggerSpec.components = {
        ...swaggerSpec.components,
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    };

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Terrano API Documentation"
    }));

    app.get("/api-docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};
