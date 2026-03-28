import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
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
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/entities/*.ts"], // Path to the API specs
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
    // Serve Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Terrano API Documentation"
    }));
    
    // Serve swagger spec as JSON
    app.get("/api-docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};
