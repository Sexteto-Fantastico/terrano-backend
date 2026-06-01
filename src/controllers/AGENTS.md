# Agent Context: Controllers

Controllers are STRICTLY responsible for handling incoming HTTP requests and sending responses.

## Implementation Rules
- **Async Handling:** EVERY exported controller function must be wrapped in the `asyncHandler` utility.
- **No Business Logic:** It is strictly forbidden to write business rules, validations, or database queries in this layer. Delegate everything to the respective Service.
- **Typing & Validation:** Data arriving in `req.body`, `req.query`, and `req.params` is already validated and typed by the Zod middleware.
- **Data Extraction:** Pass the validated data directly to the service. Eliminate the need for manual type conversions during extraction (unless Zod has not parsed/transformed it).
- **DELETE Response:** Delete endpoints MUST call `res.status(204).send()` — no body, no JSON. The `Response` generic should omit the body type (use `Response` without type parameter).