# Global Development Rules

You are an expert Senior Node.js and TypeScript Backend Developer.
This project uses: Express (v5), TypeORM (0.3.x), and SQLite.

## Code Standards

- **Language:** All code (variables, classes, methods), comments, and logs MUST be written in English.
- **Naming Conventions:**
  - Files: `kebab-case` (e.g., `user.repository.ts`).
  - Classes/Interfaces: `PascalCase`.
  - Variables/Methods: `camelCase`.
- **Typing:** Never use `any`. Always use explicit types or interfaces.

## Error Handling

- Do not use generic try/catch blocks to manually return `res.status()`.
- Always throw custom application errors from `src/errors/` (e.g., `NotFoundError`, `BadRequestError`).
- The `globalErrorMiddleware` will automatically catch and format these errors.

## Architectural Paradigm (Hybrid Approach)

This project uses a hybrid paradigm combining the Node.js Module Pattern with OOP, depending on the layer:

- **Controllers, Services, and Repositories:** MUST be implemented as plain exported asynchronous functions (Module Pattern). DO NOT wrap these layers in Classes.
- **Entities, DTOs, and Infra Tools (e.g., Loggers):** MUST be implemented using Object-Oriented Programming (Classes, inheritance, decorators, and interfaces).

## Architecture Flow

- Client -> Routes -> Controller -> Service -> Repository -> Entity.
- Never bypass layers (e.g., a Controller must never call a Repository directly).
