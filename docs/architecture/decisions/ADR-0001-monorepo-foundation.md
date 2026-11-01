# ADR-0001 — Monorepo Foundation

## Status

Accepted.

## Context

The platform is implemented as a TypeScript-first modular monorepo. Product specifications require strict package boundaries, pnpm workspaces, Turborepo orchestration, PostgreSQL with Drizzle ORM, and a CI pipeline.

## Decision

- Use pnpm workspaces for dependency management.
- Use Turborepo for task orchestration and caching.
- Use NodeNext module resolution with strict TypeScript.
- Keep application logic in `packages/*` and executable applications in `apps/*`.
- Keep database access isolated in `packages/database`.
- Use PostgreSQL through Drizzle ORM and committed migrations.
- Use Vitest for unit and integration tests.
- Use GitHub Actions for CI.

## Consequences

- Packages must declare explicit public entry points.
- Cross-package imports must use package names, never relative paths.
- Database schema changes require committed migrations.
- Phase 0 establishes the foundation only; product features arrive in later phases.
