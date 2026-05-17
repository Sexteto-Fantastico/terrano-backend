# Agent Context: Routes

This layer is strictly responsible for mapping HTTP endpoints to Controller functions, applying middlewares, and registering the API documentation.

## Implementation Rules
- **Single Source of Truth:** Route files are the single source of truth for endpoints and their OpenAPI documentation.
- **Route Builder (`createRoute`):** It is MANDATORY to use the `createRoute` utility from `../utils/route-builder` to define routes. This function handles both Express router registration and OpenAPI documentation.
- **Endpoint Constants:** Combine the literal strings from `../utils/constants/endpoints` with the endpoint documentation. Pass the specific path (e.g. `Endpoints.USERS.GET_BY_ID`) and its `basePath` to `createRoute`.
- **Validation Injection:** `createRoute` will automatically inject `validateRequest` if a Zod schema is provided in the `request` property of its configuration.
- **Async Handling:** `createRoute` automatically wraps the main handler in `asyncHandler()`. You do not need to wrap it manually.
- **Middlewares:** Apply authentication (`authMiddleware`) or other custom middlewares using the `middlewares` array property inside the `createRoute` configuration.
- **No Logic:** It is strictly forbidden to write any data manipulation, response handling (`res.send`), or business logic in this layer.