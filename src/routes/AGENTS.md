# Agent Context: Routes

This layer is strictly responsible for mapping HTTP endpoints to Controller functions, applying middlewares, and documenting the API.

## Implementation Rules
- **Endpoint Constants:** NEVER hardcode route paths (e.g., `"/api/users"`). Always use the `Endpoints` constant object imported from `../utils/constants/endpoints`.
- **Async Handling:** Every controller function passed to a route MUST be wrapped in `asyncHandler()` from `../utils/async-handler`.
- **Documentation:** Every route MUST have a JSDoc block above it with Swagger/OpenAPI documentation (`@swagger` or `@openapi`), defining tags, parameters, request bodies, and expected responses using the schemas defined in the DTOs.
- **Middlewares:** Apply authentication (`authMiddleware`) or validation middlewares directly in the route definition before the controller function when necessary.
- **No Logic:** It is strictly forbidden to write any data manipulation, response handling (`res.send`), or business logic in this layer.