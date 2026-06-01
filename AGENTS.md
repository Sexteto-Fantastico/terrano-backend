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

## DTOs (`src/dtos/`)
- **Pattern:** All DTOs use Zod schemas with `z.infer<>` for types. No classes or standalone interfaces for request/response shapes.
- **Naming:**
  - Schema variables: `PascalCase + Schema` (e.g., `CreateProductSchema`, `ProductQuerySchema`).
  - Inferred types: `PascalCase` (no suffix like `Dto`/`DTO`, e.g., `ProductResponse`, not `ProductResponseDto`).
  - Request body types: `CreateXxxBody`, `UpdateXxxBody` (not `XxxRequest`).
  - Query parameter types: `XxxQuery` (e.g., `ProductQuery`).
  - Response types: `XxxResponse` (e.g., `UserResponse`).
- **Common helpers** (in `common/pagination.dto.ts`): `idParamSchema`, `activeOnlyField`, `paginationFields`, `IdParam`.
- **deletedAt** field: always `.nullable().optional()`.
- **OpenAPI registration:** `registry.register()` uses string names without `Dto` suffix (e.g., `"ProductResponse"`).

## Mappers (`toXxx` functions in DTO files)
- Named as `to` + PascalCase type name (e.g., `toProductResponse`, `toProductBrandResponseList`).
- Accept an entity (or `entity | null`) and return the response type.
- List variants use `List` suffix (e.g., `toProductBrandResponseList`).

## Routes (`src/routes/`)
- **Architecture:** each route file follows: `validation(validate(schema))` -> `controllerMethod`.
- **HTTP Methods & Status Codes:**
  - `POST` → `201 Created`
  - `GET` single/list → `200 OK`
  - `PUT`/`PATCH` → `200 OK`
  - `DELETE` → `204 No Content`
  - `RESTORE` → `PATCH` with `200 OK`
- **OpenAPI tags:** PascalCase, singular (e.g., `Product`, `ProductBrand`).
- `idParamSchema` from `common/pagination.dto.ts` is re-exported in each domain DTO for route param validation.

## Controllers (`src/controllers/`)
- Always `async` functions with `(req: Request, res: Response, next: NextFunction)` signature.
- Extract validated data from `req.body`, `req.query`, `req.params` — never access raw `req` properties.
- Call service functions and return `res.status(code).json(response)`.
- Do NOT use try/catch — errors propagate to `globalErrorMiddleware`.

## Services (`src/services/`)
- Always `async` functions.
- Use `NotFoundError`, `BadRequestError`, `ConflictError` from `src/errors/` to signal failures.
- Call repository methods directly — never call other services.
- Map entities to DTOs using mapper functions before returning to controller.

## Repositories (`src/repositories/`)
- Always `async` functions that accept a query DTO type for filtering/pagination.
- Use `FindManyOptions` / `FindOptionsWhere` from TypeORM.
- Return entities, never DTOs.
