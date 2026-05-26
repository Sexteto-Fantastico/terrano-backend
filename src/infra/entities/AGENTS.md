# Agent Context: Entities

This layer defines the database schema and object-relational mapping.

## Implementation Rules

- **Base Entity:** Almost all entities MUST extend `TerranoBaseEntity` to inherit `id`, `created_at`, `updated_at`, and `deleted_at`.
- **Interfaces:** Define an `I[EntityName]` interface for the constructor to ensure strict typing during instantiation.
- **Foreign Keys:** Explicitly configure `@JoinColumn({ name: "column_id" })` in `@ManyToOne` relationships to enforce snake_case naming in the database.
