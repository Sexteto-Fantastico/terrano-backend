# Agent Context: DTOs (Data Transfer Objects)

This layer defines the strict data contracts for input and output, and is the source of truth for validation.

## Implementation Rules
- **Strictly Dumb & Data-Focused:** The DTO layer must be strictly dumb and focused on data. It should ONLY contain Zod Schema definitions (`z.object`), type inference (`z.infer`), and mapping functions. Route registrations MUST NEVER be done here.
- **Structure:** Use **Zod schemas** (`z.object({...})`) to define input DTOs (Request Body, Query, Params). Import `z` and `registry` from `../infra/config/openapi` instead of directly from `zod`.
- **OpenAPI Annotations:** Add `.openapi({ example: ... })` to schema fields for automatic Swagger documentation enrichment.
- **Schema Registration:** Register reusable body/response schemas with `registry.register('ModelName', schema)` for `$ref` reuse in the generated OpenAPI spec.
- **Type Inference:** Infer static types from schemas using `export type MyDto = z.infer<typeof mySchema>`. Do NOT define separate classes or interfaces for response types — the Zod schema is the single source of truth. The schema's `registry.register(...)` call doubles as the OpenAPI definition, and `z.infer` provides the TypeScript type at zero cost.
- **Naming Convention:** ALL property names in schemas and DTOs MUST use `camelCase` (e.g., `activeOnly`, `costCenterCode`, `managerId`).
- **Mappers:** Export plain mapping functions (e.g., `toUserResponseDto(entity: User): UserResponseDto`) at the bottom of the file. The return type must use `z.infer<typeof Schema>` inferred types from the response schema — never a separately defined class or interface.
- **Database Alignment:** The DTO layer is responsible for translating database `snake_case` or entity properties into `camelCase` for the frontend.
- **Security & Privacy:** NEVER include sensitive fields (like `password` or `password_reset_token`) in Response DTOs.
- **Audit Fields Policy:** - **Prohibited:** Purely internal audit fields such as `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` MUST NOT be returned in API responses.
    - **Allowed:** Fields with associated functional logic, such as `deletedAt` (used to handle `activeOnly` filters and soft-delete state), SHOULD be included in Response DTOs when relevant to the frontend's state management.
- **Typing:** Do not use `any`. Rely on Zod to generate static types for requests, and specify explicit types for responses.
- **Shared Helpers:** Always import reusable schemas from `./common/pagination.dto.ts` instead of redefining them:
  - `idParamSchema` for `/:id` params (coerces to positive integer)
  - `activeOnlyField` for soft-delete filter (`"true" | "false" | ""` → `boolean`)
  - `paginationFields` for list query params (`pageIndex`, `pageSize`, `sortBy`, `sortOrder`)
- **Naming Convention — `Dto` suffix:** Response type aliases MUST use `Dto` (camelCase), never `DTO` (uppercase). Example: `ProductResponseDto`, `CreateProductBrandDto`.
- **`deletedAt` Field Pattern:** All response schemas with soft-delete support MUST define `deletedAt` as `z.date().nullable().optional()` (both nullable and optional) to match the database type `Date | null`.
- **Auth vs User Separation:** Auth-related schemas (login, password flow, `MeResponse`) MUST be defined in `src/dtos/auth.dto.ts`, not in `user.dto.ts`. Shared schemas (`RoleResponseSchema`, `DepartmentResponseSchema`) remain in `user.dto.ts` and are imported by `auth.dto.ts`.