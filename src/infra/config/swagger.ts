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
        tags: [
            {
                name: "Users",
                description: "User management endpoints",
            },
            {
                name: "Auth",
                description: "Authentication and password reset endpoints",
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
            schemas: {
                RoleDto: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                    },
                },
                DepartmentDto: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                    },
                },
                UserResponseDto: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        phone: { type: "string" },
                        cpf: { type: "string" },
                        email: { type: "string" },
                        username: { type: "string" },
                        role: { $ref: "#/components/schemas/RoleDto" },
                        department: { $ref: "#/components/schemas/DepartmentDto" },
                        managedDepartments: {
                            type: "array",
                            items: { $ref: "#/components/schemas/DepartmentDto" },
                        },
                        isActive: { type: "boolean" },
                        requiresPasswordReset: { type: "boolean" },
                    },
                },
                LoginRequestDto: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string" },
                    },
                },
                LoginResponseDto: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                        expiresAt: { type: "string", format: "date-time" },
                        mustResetPassword: { type: "boolean" },
                    },
                },
                ForgotPasswordRequestDto: {
                    type: "object",
                    required: ["email"],
                    properties: {
                        email: { type: "string", format: "email" },
                    },
                },
                ResetPasswordRequestDto: {
                    type: "object",
                    required: ["token", "password"],
                    properties: {
                        token: { type: "string" },
                        password: { type: "string" },
                    },
                },
                DefinePasswordRequestDto: {
                    type: "object",
                    required: ["password"],
                    properties: {
                        password: { type: "string" },
                    },
                },
                CreateUserRequestDto: {
                    type: "object",
                    required: ["name", "email", "username", "password"],
                    properties: {
                        name: { type: "string" },
                        phone: { type: "string" },
                        cpf: { type: "string" },
                        email: { type: "string" },
                        username: { type: "string" },
                        password: { type: "string" },
                        roleId: { type: "number" },
                        departmentId: { type: "number" },
                        updatedBy: { type: "number" },
                    },
                },
                UpdateUserRequestDto: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        phone: { type: "string" },
                        cpf: { type: "string" },
                        email: { type: "string" },
                        username: { type: "string" },
                        roleId: { type: "number" },
                        departmentId: { type: "number" },
                        updatedBy: { type: "number" },
                    },
                },
                ChangePasswordRequestDto: {
                    type: "object",
                    required: ["password"],
                    properties: {
                        password: { type: "string" },
                        updatedBy: { type: "number" },
                    },
                },
                DeleteUserRequestDto: {
                    type: "object",
                    properties: {
                        updatedBy: { type: "number" },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/routes/*.{ts,js}",
        "./src/controllers/*.{ts,js}",
        "./src/entities/*.{ts,js}",
        "./dist/routes/*.{ts,js}",
        "./dist/controllers/*.{ts,js}",
        "./dist/entities/*.{ts,js}"
    ], // Path to the API specs
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
