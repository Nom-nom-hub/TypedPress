# ARCHITECTURE.md

# System Architecture Specification

**Project:** TypeScript-Native Website, CMS & Application Platform  
**Status:** Foundational architecture contract  
**Applies to:** Entire repository

## 1. Architectural Objective

Build a modular, extensible, TypeScript-native platform that combines:

- A headless content management system.
- A visual React website builder.
- A React application development platform.
- A theme and component ecosystem.
- A secure plugin system.
- A self-hosted deployment model.

The architecture must support both developers building complete applications and non-developers managing websites through a visual interface.

The system must not become a monolithic application with tightly coupled subsystems.

## 2. Architectural Principles

1. TypeScript is the primary implementation language.
2. Core business logic must remain independent of Next.js.
3. React is the primary component and rendering technology.
4. PostgreSQL is the primary relational database.
5. Every subsystem must expose defined interfaces.
6. Packages must not import internal files from other packages.
7. All external integrations must use adapters.
8. Security boundaries must be enforced server-side.
9. The platform must support self-hosted deployment without mandatory cloud dependencies.
10. Optional services must never become mandatory platform dependencies.

## 3. Repository Structure

Use pnpm workspaces and Turborepo.

    /
    ├── apps/
    │   ├── admin/
    │   ├── api/
    │   ├── site/
    │   └── docs/
    │
    ├── packages/
    │   ├── core/
    │   ├── database/
    │   ├── content/
    │   ├── auth/
    │   ├── permissions/
    │   ├── media/
    │   ├── editor/
    │   ├── components/
    │   ├── renderer/
    │   ├── themes/
    │   ├── plugins/
    │   ├── plugin-sdk/
    │   ├── api-client/
    │   ├── validation/
    │   ├── config/
    │   ├── logger/
    │   ├── ui/
    │   └── types/
    │
    ├── tooling/
    ├── examples/
    ├── scripts/
    ├── docs/
    ├── docker/
    ├── pnpm-workspace.yaml
    ├── turbo.json
    └── package.json

## 4. Package Responsibilities

### Applications

**apps/admin**

- Administrative interface.
- Visual website editor.
- Content management.
- Media management.
- Theme management.
- Plugin management.
- User and permission management.
- System configuration.

**apps/api**

- HTTP API.
- Authentication endpoints.
- Content endpoints.
- Media endpoints.
- Plugin management endpoints.
- Administrative operations.
- API documentation.

**apps/site**

- Next.js application integration.
- Public website rendering.
- Server-side rendering.
- Static generation.
- Revalidation.
- Preview rendering.

**apps/docs**

- Developer documentation.
- User documentation.
- Plugin SDK documentation.
- Theme development guides.

### Core Packages

**core**

- Platform lifecycle.
- Core interfaces.
- Dependency registration.
- Event infrastructure.
- Application context.

**database**

- Database connection management.
- Schema definitions.
- Migrations.
- Transactions.
- Repository implementations.

**content**

- Content types.
- Entries.
- Fields.
- Revisions.
- Publishing lifecycle.
- Content validation.

**auth**

- Authentication.
- Sessions.
- Password management.
- Identity providers through adapters.

**permissions**

- Roles.
- Capabilities.
- Resource-level authorization.
- Permission evaluation.

**media**

- File metadata.
- Upload processing.
- Image transformations.
- Storage adapters.

**editor**

- Editor document model.
- Editor state.
- Commands.
- History.
- Component registry integration.

**components**

- Component definitions.
- Component metadata.
- Property schemas.
- Component registration.

**renderer**

- Document validation.
- Component resolution.
- React rendering.
- Rendering policies.

**themes**

- Theme manifests.
- Theme registration.
- Theme lifecycle.
- Theme compatibility.

**plugins**

- Plugin installation.
- Plugin lifecycle.
- Plugin registry.
- Plugin permissions.
- Plugin execution boundaries.

**plugin-sdk**

- Public plugin interfaces.
- Type definitions.
- Registration APIs.
- Plugin development utilities.

**api-client**

- Typed API client.
- Request handling.
- Response validation.

**validation**

- Shared schemas.
- Runtime validation.
- Input sanitization.

**config**

- Environment configuration.
- Platform configuration.
- Configuration validation.

**logger**

- Structured logging.
- Log levels.
- Contextual metadata.

**ui**

- Shared administrative design system.
- Accessible primitives.
- Shared interface components.

**types**

- Shared public types only.
- No business logic.

## 5. Dependency Rules

Dependencies must flow toward lower-level abstractions.

Required direction:

    Applications
        ↓
    Platform services
        ↓
    Core interfaces
        ↓
    Infrastructure adapters

Rules:

- `core` must not import application code.
- `database` must not import React or Next.js.
- `content` must not depend on the admin interface.
- `editor` must not depend on a specific theme.
- `renderer` must use registered component definitions.
- `plugin-sdk` must not expose internal implementation details.
- Client-side code must never access database credentials.
- No circular package dependencies.
- No cross-package deep imports.

Use package exports to define public APIs.

## 6. Runtime Architecture

Separate the system into logical runtime environments:

**Administrative runtime**

- React-based administration.
- Editor state.
- Client-side interactions.
- Typed API communication.

**API runtime**

- Authentication.
- Authorization.
- Business logic.
- Database operations.
- Plugin management.

**Rendering runtime**

- Server-side React rendering.
- Theme resolution.
- Component resolution.
- Content retrieval.
- Preview and publishing.

**Background runtime**

- Scheduled publishing.
- Media processing.
- Webhooks.
- Plugin jobs.
- Maintenance tasks.

Do not assume all runtimes must be separate processes in the initial release. Keep their interfaces separable so they can be deployed independently later.

## 7. Multi-Site Architecture

The platform must support multiple sites.

Each site must have:

- A unique identifier.
- Site configuration.
- Domain configuration.
- Theme configuration.
- Content namespace.
- Media association.
- Plugin configuration.
- Localization settings.

All site-owned database queries must enforce site scope.

Never rely on a client-supplied site identifier as proof of authorization.

## 8. Rendering Architecture

The rendering pipeline:

1. Resolve the requested site.
2. Resolve the requested route.
3. Retrieve published content.
4. Resolve the active theme.
5. Load the versioned page document.
6. Validate the document.
7. Resolve registered components.
8. Validate component properties.
9. Render React elements.
10. Apply metadata and SEO configuration.
11. Return the rendered result.

Unregistered components must not execute.

Unknown component versions must produce a controlled rendering error, not arbitrary code execution.

## 9. Integration Architecture

Use adapters for:

- Object storage.
- Email.
- Search.
- Cache.
- Authentication providers.
- AI providers.
- Deployment targets.

Provide a local default implementation where practical.

Do not make the platform dependent on a single commercial provider.

## 10. Application Development Support

The platform must support:

- Custom React components.
- Custom server-side functionality.
- Typed API access.
- Custom routes.
- Middleware integration.
- External services.
- Custom application modules.

The CMS must remain usable without the visual editor.

The visual editor must remain usable without requiring developers to write application code.

## 11. Observability

Implement:

- Structured logs.
- Request IDs.
- Error tracking interfaces.
- Health checks.
- Background job status.
- Database migration status.
- Plugin lifecycle logs.
- Audit logs for administrative actions.

Never log passwords, access tokens, secrets, or sensitive session information.

## 12. Testing Requirements

Every package must include appropriate tests.

Required:

- Unit tests for domain logic.
- Integration tests for database operations.
- API contract tests.
- Rendering tests.
- Plugin permission tests.
- End-to-end tests for critical user workflows.

Architecture tests must verify package boundaries and prevent circular dependencies.

## 13. Architecture Decision Records

Create:

    docs/architecture/decisions/

Record major decisions involving:

- Framework selection.
- Database design.
- Document format.
- Plugin isolation.
- Rendering strategy.
- Authentication.
- Storage.
- Deployment.

Every major architecture change must include a decision record.

## 14. Implementation Rules

Before implementing a subsystem:

1. Inspect existing implementation.
2. Identify its public interfaces.
3. Review package dependencies.
4. Review applicable specifications.
5. Implement the smallest complete vertical slice.
6. Add tests.
7. Verify the implementation.
8. Update documentation.

Do not create empty packages simply to satisfy the directory structure.

Do not create abstractions without a concrete use case.

Do not replace working implementations with speculative architecture.

## 15. Acceptance Criteria

The architecture is acceptable when:

- Package boundaries are documented and enforced.
- Core business logic is independent of Next.js.
- Applications communicate through defined contracts.
- Site isolation is enforced.
- Rendering is based on validated component documents.
- Plugins cannot bypass platform permissions.
- Storage and external integrations are replaceable.
- Tests verify architectural constraints.
- A clean installation can build and run the platform.
