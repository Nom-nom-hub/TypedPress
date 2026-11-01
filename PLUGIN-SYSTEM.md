# PLUGIN-SYSTEM.md

# Plugin Architecture & Developer SDK Specification

**Status:** Foundational extensibility contract  
**Applies to:** `packages/plugins`, `packages/plugin-sdk`, `packages/core`, `packages/permissions`, `apps/admin`, `apps/api`

## 1. Objective

Build a secure, versioned TypeScript plugin ecosystem.

Plugins must allow developers to extend the platform without modifying core source code.

The plugin system must support:

- Administrative extensions.
- Custom content types.
- Custom fields.
- React components.
- Editor integrations.
- API endpoints.
- Background jobs.
- Event handlers.
- External integrations.
- Custom workflows.
- Database migrations.

## 2. Core Principles

1. Plugins are versioned packages.
2. Plugins declare their capabilities.
3. Permissions must be explicit.
4. Plugin installation must be validated.
5. Plugin lifecycle operations must be auditable.
6. Plugins must not receive unrestricted database access.
7. Plugins must not automatically receive administrative privileges.
8. Plugin dependencies must be resolved and validated.
9. Plugin failures must not silently corrupt platform state.
10. Disabling a plugin must not automatically delete its data.

## 3. Plugin Manifest

Every plugin must provide a manifest.

Example:

    {
      "schemaVersion": 1,
      "id": "example.analytics",
      "name": "Example Analytics",
      "version": "1.0.0",
      "description": "Analytics integration",
      "author": "Example Developer",
      "platform": {
        "minimumVersion": "1.0.0"
      },
      "entrypoints": {
        "server": "./dist/server.js",
        "admin": "./dist/admin.js"
      },
      "permissions": [
        "content.read",
        "analytics.write"
      ],
      "contributions": {
        "adminPages": true,
        "components": false,
        "contentTypes": false,
        "apiRoutes": true,
        "jobs": true
      }
    }

Validate manifests against a versioned runtime schema.

Do not trust manifest declarations without checking actual registrations and permissions.

## 4. Plugin Identity

Every plugin must have:

- Globally unique identifier.
- Name.
- Version.
- Manifest schema version.
- Platform compatibility declaration.
- Entrypoint definitions.
- Dependency declarations.
- Capability declarations.
- Permission requirements.

Use semantic versioning.

Reject invalid identifiers and incompatible versions.

## 5. Plugin Lifecycle

Implement explicit lifecycle states:

- DISCOVERED.
- VALIDATING.
- INSTALLED.
- ENABLED.
- DISABLED.
- UPDATING.
- UNINSTALLED.
- FAILED.

These names are the canonical lifecycle vocabulary shared with `AGENTS.md`.

Lifecycle operations:

1. Discover.
2. Validate.
3. Resolve dependencies.
4. Review permissions.
5. Install.
6. Run migrations.
7. Register contributions.
8. Enable.
9. Disable.
10. Upgrade.
11. Uninstall.

Lifecycle operations must be transactional where possible.

Failed installation must leave the platform in a recoverable state.

## 6. Permissions and Capabilities

Plugins must declare required capabilities.

Initial capability categories:

- `content.read`
- `content.write`
- `media.read`
- `media.write`
- `users.read`
- `settings.read`
- `settings.write`
- `events.subscribe`
- `jobs.register`
- `api.register`
- `editor.components`
- `admin.pages`
- `storage.plugin`

Permissions must be scoped to the appropriate site and resource.

A plugin must only receive permissions explicitly granted by an authorized administrator.

The permission system must support revocation.

Permission checks must happen server-side for every protected operation.

## 7. Execution Isolation

Treat plugins as untrusted code.

Do not claim that JavaScript worker threads provide a secure sandbox.

Do not execute arbitrary plugin code inside the primary API process with unrestricted access.

Use a capability-based execution model.

Recommended initial separation:

**Trusted platform process**

- Core services.
- Authentication.
- Authorization.
- Database access.
- Plugin registry.
- Permission evaluation.

**Plugin execution environment**

- Plugin functionality.
- Restricted capabilities.
- Validated requests.
- Controlled communication with platform services.

For untrusted third-party server code, use an isolated process or container with:

- Restricted filesystem access.
- Restricted network access.
- Resource limits.
- No direct database credentials.
- Controlled IPC or RPC.
- Explicit capability authorization.

If secure isolation is not implemented, restrict the initial plugin system to trusted, locally installed packages and clearly document that trust model.

Never advertise an unsafe execution model as sandboxed.

## 8. Plugin SDK

Provide a public SDK.

Example API:

    export default definePlugin({
      id: "example.analytics",
      version: "1.0.0",

      register(api) {
        api.admin.registerPage({
          id: "analytics.dashboard",
          label: "Analytics",
          component: AnalyticsDashboard
        });

        api.events.subscribe(
          "content.published",
          handlePublishedContent
        );
      }
    });

The example is illustrative; actual APIs must be typed and permission-checked.

SDK requirements:

- TypeScript definitions.
- Manifest validation.
- Plugin lifecycle interfaces.
- Event interfaces.
- Admin registration.
- Component registration.
- Content type registration.
- API registration.
- Job registration.
- Logging interface.
- Configuration interface.
- Storage interface.
- Permission declarations.

Plugins must use documented public SDK interfaces.

Do not expose internal database models as the primary plugin API.

## 9. Plugin Contributions

### Admin pages

Plugins may register administrative screens.

Requirements:

- Namespaced route.
- Permission declaration.
- Navigation metadata.
- Component entrypoint.
- Error boundary.

### Content types

Plugins may register content types and fields.

Requirements:

- Namespaced identifiers.
- Schema validation.
- Migration support.
- Site scoping.
- Conflict detection.

### Visual components

Plugins may register React components for the visual editor.

Requirements:

- Stable component identifiers.
- Versioned schemas.
- Default properties.
- Validated property definitions.
- Rendering compatibility.
- Editor metadata.

### API routes

Plugins may register API endpoints through controlled interfaces.

Requirements:

- Namespaced paths.
- Authentication policy.
- Permission checks.
- Request validation.
- Response validation.
- Rate limiting where appropriate.

### Events

Plugins may subscribe to platform events.

Initial events:

- `content.created`
- `content.updated`
- `content.published`
- `content.archived`
- `media.uploaded`
- `site.created`
- `site.updated`
- `plugin.enabled`
- `plugin.disabled`

Events must have documented, versioned payloads.

### Background jobs

Plugins may register jobs.

Requirements:

- Unique job identifiers.
- Retry policy.
- Execution timeout.
- Status tracking.
- Idempotency.
- Failure reporting.

## 10. Database Migrations

Plugins may own namespaced database tables.

Rules:

- Migrations must be versioned.
- Migration execution must be controlled by the platform.
- Plugins must not alter core tables directly.
- Migration failures must be reported.
- Upgrade paths must be tested.
- Destructive migrations require explicit safeguards.

## 11. Plugin Configuration

Provide validated configuration schemas.

Support:

- Installation configuration.
- Site-specific configuration.
- Encrypted secret storage.
- Configuration validation.
- Configuration versioning.

Never expose secret configuration values to browser clients.

## 12. Installation Sources

The system should eventually support:

- Local packages.
- Git repositories.
- Package registry.
- Private registries.
- Official plugin directory.

Initial implementation should prioritize local packages and a controlled registry workflow.

Do not automatically install arbitrary packages from unverified URLs.

Verify package integrity and provenance where supported.

## 13. Updates and Compatibility

Support:

- Version checking.
- Compatibility validation.
- Update installation.
- Migration execution.
- Failure recovery.
- Rollback strategy where possible.

Do not silently update plugins.

Administrators must be able to review version changes and required permissions.

## 14. Uninstall Behavior

Uninstalling a plugin must distinguish:

- Disabling execution.
- Removing registrations.
- Removing plugin files.
- Retaining plugin data.
- Deleting plugin data.

Data deletion must require an explicit action and appropriate authorization.

## 15. Plugin Administration Interface

Provide:

- Installed plugins.
- Plugin status.
- Version.
- Compatibility.
- Permissions.
- Configuration.
- Enable/disable.
- Update.
- Installation.
- Error logs.
- Uninstall.

Show required permissions before installation or activation.

Make security implications visible.

## 16. Developer Experience

Provide:

- Plugin creation CLI command.
- Starter template.
- TypeScript SDK.
- Manifest validation.
- Local development mode.
- Build command.
- Test command.
- Documentation.
- Example plugins.

A developer must be able to create, build, validate, and locally test a plugin without modifying platform source code.

## 17. Testing Requirements

Test:

- Manifest validation.
- Compatibility checks.
- Permission enforcement.
- Permission revocation.
- Lifecycle transitions.
- Dependency resolution.
- Failed installation recovery.
- Migration behavior.
- Event delivery.
- Job retries.
- Component registration.
- API route authorization.
- Plugin isolation boundaries.

## 18. Acceptance Criteria

The initial plugin system is complete when:

1. A developer can create a plugin using the SDK.
2. The plugin manifest is validated.
3. The platform can discover and install it.
4. Permissions are displayed and granted explicitly.
5. The plugin can register an administrative page.
6. The plugin can register an event handler.
7. The plugin can register a custom editor component.
8. The plugin can register controlled API functionality.
9. The plugin can be enabled and disabled.
10. Plugin failures are reported.
11. Plugin-owned data is preserved when disabled.
12. Security boundaries are documented and tested.

The plugin system must prioritize security and compatibility over the number of supported extension points.
