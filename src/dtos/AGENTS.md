# Agent Context: DTOs (Data Transfer Objects)

This layer defines the strict data contracts for input and output.

## Implementation Rules
- **Structure:** Use TypeScript classes to define `Request` and `Response` schemas.
- **Naming Convention:** ALL property names in DTOs (Request, Query, and Response) MUST use `camelCase` (e.g., `onlyActive`, `costCenterCode`, `managerId`).
- **Mappers:** Export mapping functions (e.g., `toUserResponseDto(entity: User)`) at the bottom of the file to centralize transformation logic.
- **Database Alignment:** The DTO layer is responsible for translating database `snake_case` or entity properties into `camelCase` for the frontend.
- **Security & Privacy:** NEVER include sensitive fields (like `password` or `password_reset_token`) in Response DTOs.
- **Audit Fields Policy:** - **Prohibited:** Purely internal audit fields such as `createdAt`, `updatedAt`, `createdBy`, and `updatedBy` MUST NOT be returned in API responses.
    - **Allowed:** Fields with associated functional logic, such as `deletedAt` (used to handle `activeOnly` filters and soft-delete state), SHOULD be included in Response DTOs when relevant to the frontend's state management.
- **Typing:** Do not use `any`. Always specify primitive types or use other DTOs for nested objects.