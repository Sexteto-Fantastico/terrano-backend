# Agent Context: Routes

This layer is strictly responsible for mapping HTTP endpoints to Controller functions and applying middlewares.

## Implementation Rules
- **Endpoint Constants:** NEVER hardcode route paths (e.g., `"/api/users"`). Always use the `Endpoints` constant object imported from `../utils/constants/endpoints`.
- **Async Handling:** Every controller function passed to a route MUST be wrapped in `asyncHandler()` from `../utils/async-handler`.
- **No JSDoc/Swagger Comments:** Route files MUST NOT contain any JSDoc blocks (`@swagger` / `@openapi`). All API documentation is generated programmatically via `registry.registerPath()` calls in the DTO files.
- **Middlewares:** Apply authentication (`authMiddleware`) directly in the route definition. **CRITICAL:** ALL routes that receive `body`, `query`, or `params` MUST obligatorily use the Zod validation middleware (`validateRequest`) passing the respective DTO schema before calling the controller.
- **No Logic:** It is strictly forbidden to write any data manipulation, response handling (`res.send`), or business logic in this layer.