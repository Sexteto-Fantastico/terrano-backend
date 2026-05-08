# Agent Context: Controllers

Controllers are STRICTLY responsible for handling incoming HTTP requests and sending responses.

## Implementation Rules
- **Async Handling:** EVERY exported controller function must be wrapped in the `asyncHandler` utility.
- **No Business Logic:** It is strictly forbidden to write business rules, validations, or database queries in this layer. Delegate everything to the respective Service.
- **Typing:** Strongly type requests using the appropriate DTOs (`Request<Params, ResBody, ReqBody, ReqQuery>`).
- **Data Extraction:** Always extract and parse parameters before passing them to the service (e.g., `Number(req.params.id)`).