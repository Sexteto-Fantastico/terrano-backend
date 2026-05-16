# Agent Context: Services

This layer contains all business logic, validation, and data orchestration.

## Implementation Rules
- **Database Access:** Services MUST NOT import `AppDataSource` directly. They must call exported functions from `src/repositories/`.
- **Validation & Exceptions:** This layer must handle ONLY **Business Rules and Database Validations** (e.g., check if an ID exists, if a code is already in use). DO NOT perform format, presence, or data type validations (like checking if a string is empty or a number is negative), as this is handled by Zod schemas in the DTO layer with automatic validation via the `validateRequest` middleware. If a validation fails, halt the flow by throwing:
  - `throw new ConflictError("...")` for duplicate constraints.
  - `throw new NotFoundError("...")` when a resource does not exist.
  - `throw new BadRequestError("...")` for logical business constraints (not for invalid basic input format).
- **DTO Mapping:** Always transform raw TypeORM Entities into Response DTOs before returning the data to the Controller (use mapping functions like `toResponseDto`).