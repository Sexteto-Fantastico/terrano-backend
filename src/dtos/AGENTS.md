# Agent Context: DTOs (Data Transfer Objects)

This layer defines the strict data contracts for input and output.

## Implementation Rules
- **Structure:** Use TypeScript classes to define `Request` and `Response` schemas.
- **Naming Convention:** ALL property names in DTOs (Request, Query, and Response) MUST use `camelCase` (e.g., `onlyActive`, `costCenterCode`, `managerId`).
- **Mappers:** Export mapping functions (e.g., `toUserResponseDto(entity: User)`) at the bottom of the file to centralize transformation logic.
- **Database Alignment:** Even if the database or entities use snake_case, the DTO layer is responsible for translating these into `camelCase` for the frontend.
- **Security:** NEVER include sensitive fields (like `password` or `password_reset_token`) in Response DTOs.
- **Typing:** Do not use `any`. Always specify the primitive type or use other DTOs for nested objects.