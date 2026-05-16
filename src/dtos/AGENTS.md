# Agent Context: DTOs (Data Transfer Objects)

This layer defines the strict data contracts for input and output, and is the source of truth for both validation and API documentation.

## Implementation Rules
- **Structure:** Use **Zod schemas** (`z.object({...})`) to define input DTOs (Request Body, Query, Params). Import `z` and `registry` from `../infra/config/openapi` instead of directly from `zod`.
- **OpenAPI Annotations:** Add `.openapi({ example: ... })` to schema fields for automatic Swagger documentation enrichment.
- **Schema Registration:** Register reusable body/response schemas with `registry.register('ModelName', schema)` for `$ref` reuse in the generated OpenAPI spec.
- **Route Registration:** Register each API route with `registry.registerPath({...})` inside the DTO file, defining method, path, tags, summary, request schemas, and response schemas.
- **Type Inference:** Infer static types from schemas using `export type MyDto = z.infer<typeof mySchema>`.
- **Naming Convention:** ALL property names in schemas and DTOs MUST use `camelCase` (e.g., `onlyActive`, `costCenterCode`, `managerId`).
- **Mappers:** Response DTOs can continue as interfaces/classes of mapping or schemas, but export mapping functions (e.g., `toUserResponseDto(entity: User)`) at the bottom of the file to centralize transformation logic.
- **Database Alignment:** The DTO layer is responsible for translating database `snake_case` or entity properties into `camelCase` for the frontend.
- **Security & Privacy:** NEVER include sensitive fields (like `password` or `password_reset_token`) in Response DTOs.
- **Audit Fields Policy:** - **Prohibited:** Purely internal audit fields such as `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` MUST NOT be returned in API responses.
    - **Allowed:** Fields with associated functional logic, such as `deletedAt` (used to handle `activeOnly` filters and soft-delete state), SHOULD be included in Response DTOs when relevant to the frontend's state management.
- **Typing:** Do not use `any`. Rely on Zod to generate static types for requests, and specify explicit types for responses.