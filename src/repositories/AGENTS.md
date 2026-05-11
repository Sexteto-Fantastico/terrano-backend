# Agent Context: Repositories

This is the ONLY layer authorized to interact directly with TypeORM and the database.

## Implementation Rules
- **Operations:** Use TypeORM methods like `find()`, `findOne()`, `save()`, or `softRemove()`.
- **Return Types:** Always return pure TypeORM Entities or `null`. Never convert data to DTOs in this layer.
- **Soft Deletes:** Prioritize the use of `softRemove()` and `recover()` for any entity extending `TerranoBaseEntity`.
- **Relationships:** Always explicitly load necessary relations using the `relations` array in your queries.