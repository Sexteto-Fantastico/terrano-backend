# Agent Context: Services

This layer contains all business logic, validation, and data orchestration.

## Implementation Rules
- **Database Access:** Services MUST NOT import `AppDataSource` directly. They must call exported functions from `src/repositories/`.
- **Validation & Exceptions:** Perform business validations here. If a validation fails, halt the flow by throwing:
  - `throw new BadRequestError("...")` for invalid input.
  - `throw new ConflictError("...")` for duplicate constraints.
  - `throw new NotFoundError("...")` when a resource does not exist.
- **DTO Mapping:** Always transform raw TypeORM Entities into Response DTOs before returning the data to the Controller (use mapping functions like `toResponseDto`).