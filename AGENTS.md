# AGENTS.md

# TypeScript-Native Website & Application Platform

**Document type:** Repository-wide engineering instructions  
**Authority:** Mandatory for all coding agents  
**Product:** Working-name TBD  
**Architecture:** Modular TypeScript monorepo  
**Primary framework:** Next.js App Router + React  
**Database:** PostgreSQL  
**ORM:** Drizzle  
**Package manager:** pnpm  
**Build orchestration:** Turborepo

---

# 1. YOUR ROLE

You are the principal software architect, senior full-stack engineer, UI/UX engineer, security engineer, and quality assurance engineer responsible for building this platform.

You are not building a prototype.

You are not building a dashboard template.

You are not building a superficial WordPress clone.

You are building a production-grade, extensible website and application platform intended to compete with:

- WordPress
- Webflow
- Payload CMS
- Sanity
- Strapi
- Framer
- Modern application development platforms

Your responsibility is to deliver actual working software.

Every feature must have:

- A real implementation.
- A defined architecture.
- Persistent data where applicable.
- Proper validation.
- Authorization.
- Error handling.
- Loading states.
- Empty states.
- Automated tests.
- Documentation.

A screen that looks functional but has no working implementation is NOT a completed feature.

Never report a feature as complete simply because its UI exists.

# 2. PRODUCT VISION

Build a complete website publishing and application development platform using the modern TypeScript ecosystem.

The platform must combine:

1. WordPress's content management capabilities.
2. Webflow's visual editing experience.
3. Next.js's application development capabilities.
4. Modern headless CMS architecture.
5. An extensible TypeScript plugin ecosystem.
6. A professional developer toolchain.

The platform must support two equally important audiences.

**Website owners**

- Create websites.
- Manage content.
- Edit layouts visually.
- Install themes.
- Install extensions.
- Publish content.
- Manage users.
- Manage media.

**Developers**

- Build React components.
- Develop themes.
- Develop plugins.
- Create custom content types.
- Create API integrations.
- Extend administration screens.
- Build entire applications.
- Control rendering and deployment.

Neither audience should be forced into the other's workflow.

# 3. NON-NEGOTIABLE ENGINEERING PRINCIPLES

1. TypeScript strict mode everywhere.
2. No PHP.
3. No JavaScript files for application logic unless a configuration format requires them.
4. No unnecessary dependencies.
5. No fake functionality.
6. No placeholder implementations presented as finished features.
7. No hardcoded demonstration data in production functionality.
8. No uncontrolled cross-package imports.
9. No circular dependencies.
10. No direct database access from React client components.
11. No business logic embedded inside presentation components.
12. No secrets exposed to browsers.
13. No unrestricted third-party plugin execution.
14. No mandatory cloud accounts.
15. No mandatory paid APIs.
16. No mandatory AI provider.
17. No proprietary CMS markup replacing React.
18. No framework-specific dependencies inside the CMS domain layer.
19. No breaking changes without documented migrations.
20. No unnecessary architectural complexity.

Prefer simple, composable, independently testable systems.

Do not introduce microservices prematurely.

Use modular boundaries inside a monorepo first.

# 4. REQUIRED TECHNOLOGY STACK

Use stable, compatible releases available at implementation time.

| Area                  | Technology                                   |
| --------------------- | -------------------------------------------- |
| Language              | TypeScript                                   |
| Frontend              | React                                        |
| Application framework | Next.js App Router                           |
| Styling               | Tailwind CSS                                 |
| Component primitives  | Radix UI or equivalent accessible primitives |
| Icons                 | Lucide                                       |
| Database              | PostgreSQL                                   |
| ORM                   | Drizzle ORM                                  |
| Validation            | Zod                                          |
| Package manager       | pnpm                                         |
| Monorepo              | Turborepo                                    |
| API                   | REST / OpenAPI                               |
| Authentication        | Adapter-based authentication                 |
| Media storage         | Local filesystem / S3-compatible adapters    |
| Testing               | Vitest                                       |
| Browser testing       | Playwright                                   |
| Unit UI testing       | React Testing Library                        |
| Infrastructure        | Docker                                       |
| Logging               | Structured logging                           |
| Documentation         | Markdown / generated API documentation       |

Do not upgrade dependencies blindly.

Check compatibility before introducing major framework versions.

Keep lockfiles committed.

# 5. MONOREPO ARCHITECTURE

Use a modular monorepo.

Required target structure:

```text
/
├── apps/
│   ├── admin/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── layouts/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── plugins/
│   │   │   └── server.ts
│   │   └── package.json
│   │
│   ├── site/
│   │   └── src/
│   │
│   └── docs/
│
├── packages/
│   ├── core/
│   ├── database/
│   ├── content/
│   ├── auth/
│   ├── permissions/
│   ├── media/
│   ├── themes/
│   ├── components/
│   ├── editor/
│   ├── renderer/
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
│   ├── eslint/
│   ├── typescript/
│   └── testing/
│
├── examples/
│   ├── starter-theme/
│   ├── starter-plugin/
│   └── starter-site/
│
├── scripts/
├── docs/
├── docker/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .env.example
├── .gitignore
└── AGENTS.md
```

This is the target architecture, not permission to create empty directories for every subsystem.

Create packages when they have real implementation responsibilities.

## Package boundary rules

- `core` owns framework-independent platform contracts.
- `database` owns database configuration, schema, migrations, and repositories.
- `content` owns content domain models and content operations.
- `auth` owns authentication abstractions and implementations.
- `permissions` owns authorization policies.
- `media` owns asset management and storage adapters.
- `editor` owns the structured visual editing document model.
- `renderer` owns component resolution and rendering contracts.
- `themes` owns theme registration and theme configuration.
- `plugins` owns plugin manifests, lifecycle, and extension management.
- `plugin-sdk` exposes public developer APIs.
- `ui` owns reusable design-system components.
- `api` exposes platform functionality over HTTP.
- `admin` owns the administration application.
- `site` provides the default Next.js frontend integration.

A package must never import internal files directly from another package.

Use explicit public exports.

# 6. FRAMEWORK INDEPENDENCE

This requirement is critical.

The CMS must not depend on Next.js internally.

The content engine must work through its own interfaces.

The API must be capable of serving:

- Next.js.
- React applications.
- Other frontend frameworks.
- Mobile applications.
- External integrations.
- Headless clients.

Next.js is the primary supported frontend integration, not the owner of the CMS domain.

Use Next.js Server Components for server-side data fetching and composition.

Use Client Components only where interactivity requires them.

Do not turn entire application layouts into Client Components unnecessarily.

Keep secrets, database access, and privileged operations on the server.

# 7. DATABASE AND DATA MODEL

Use PostgreSQL.

Use Drizzle ORM.

All database changes must be implemented through migrations.

Required initial entities:

```text
User
Role
Permission
UserRole
Workspace
Site
SiteMember
ContentType
ContentEntry
ContentRevision
Taxonomy
TaxonomyTerm
ContentRelationship
MediaAsset
Theme
ThemeVersion
Plugin
PluginVersion
PluginPermission
Setting
ApiKey
Webhook
AuditLog
Redirect
```

Every site-owned record must have explicit site ownership.

Every workspace-owned record must have explicit workspace ownership.

Implement tenant isolation at the repository and authorization layers.

Do not trust client-supplied site IDs or workspace IDs.

Resolve resource ownership from authenticated server-side context.

## Content storage

Use relational tables for core entities.

Use JSONB for extensible structured content where appropriate.

Do not place the entire platform database into one generic JSONB column.

Use explicit schemas and validation for custom content types.

Provide:

- Migration tracking.
- Transaction handling.
- Referential integrity.
- Appropriate indexes.
- Unique constraints.
- Backup and restore procedures.

# 8. CONTENT MANAGEMENT ENGINE

Implement a complete content management subsystem.

Required capabilities:

- Pages.
- Posts.
- Custom content types.
- Categories.
- Tags.
- Custom taxonomies.
- Relationships.
- Drafts.
- Published content.
- Scheduled publishing.
- Content revisions.
- Content restoration.
- Author attribution.
- Publishing workflows.
- Slugs.
- Custom metadata.
- Preview.
- Content search.
- Pagination.
- Filtering.

## Content lifecycle

Use explicit states:

```text
DRAFT
IN_REVIEW
SCHEDULED
PUBLISHED
ARCHIVED
```

Validate all state transitions server-side.

Do not allow unauthorized users to publish content.

Every update must preserve appropriate revision history.

Publishing must be transaction-safe.

# 9. CUSTOM CONTENT TYPE SYSTEM

Build a schema-driven custom content type system.

Users must be able to define:

- Field names.
- Field types.
- Labels.
- Required fields.
- Default values.
- Validation rules.
- Relationships.
- Display configuration.
- Editor configuration.

Initial field types:

```text
text
textarea
richtext
number
boolean
date
datetime
email
url
image
media
select
multiselect
reference
json
```

Each content type must have a versioned schema.

Changing a schema must not silently destroy existing content.

Implement schema validation and migration strategies.

Expose custom content types through the API and visual editor.

# 10. VISUAL WEBSITE EDITOR

This is a primary product subsystem.

Build a real visual React website editor.

Do not implement a mock canvas.

Do not build a generic drag-and-drop demonstration.

The editor must use a structured document representation.

## Editor layout

The interface must have three primary regions.

**Left panel**

- Pages.
- Layers.
- Components.
- Sections.
- Templates.
- Assets.
- Design tokens.

**Center**

- Live editing canvas.
- Component selection.
- Drag-and-drop.
- Responsive preview.
- Selection outlines.
- Insertion indicators.
- Zoom.
- Preview mode.

**Right panel**

- Component properties.
- Layout.
- Typography.
- Colors.
- Spacing.
- Borders.
- Effects.
- Responsive overrides.
- Advanced settings.

## Document model

Represent a page as a versioned structured document.

Example:

```ts
interface EditorDocument {
  version: number;
  root: string;
  nodes: Record<string, EditorNode>;
}

interface EditorNode {
  id: string;
  component: string;
  props: Record<string, unknown>;
  children: string[];
  styles?: ResponsiveStyles;
}
```

Use stable node IDs.

Do not use array indexes as component identity.

Implement:

- Document validation.
- Serialization.
- Deserialization.
- Schema versioning.
- Undo/redo.
- Clipboard operations.
- Copy/paste.
- Node insertion.
- Node removal.
- Node reordering.
- Parent/child validation.
- Autosave.
- Revision history.

## Component registry

Every visual component must expose metadata.

Metadata must define:

- Component identifier.
- Display name.
- Category.
- Description.
- Property schema.
- Default values.
- Editor controls.
- Supported child behavior.
- Responsive capabilities.

Use Zod or an equivalent runtime schema validator.

The inspector must be generated from the component metadata.

Do not hardcode individual property panels for every component.

Custom controls may be registered through the editor extension API.

## Visual editor rules

- Never mutate the editor document unpredictably.
- Never lose unsaved user changes.
- Always provide clear save status.
- Support keyboard shortcuts.
- Support undo and redo.
- Preserve document structure.
- Validate invalid component configurations.
- Prevent invalid nesting.
- Provide responsive preview modes.
- Make selection behavior deterministic.

The visual editor must not attempt to convert arbitrary React source code into an editable visual document.

Developers must explicitly expose visual-editable component properties.

# 11. REACT COMPONENT SYSTEM

React components are first-class platform assets.

Developers must be able to create real React components.

Components must support:

- Strong TypeScript types.
- Runtime property validation.
- Metadata registration.
- Default properties.
- Editor configuration.
- Reusable instances.
- Theme integration.
- Versioning.
- Documentation.

The component registry must distinguish:

1. Core components.
2. Theme components.
3. Extension components.
4. Site-specific components.

Never silently override an existing component identifier.

Require namespaced identifiers for external extensions.

Example:

```text
core:hero
core:container
core:button
theme:starter:hero
plugin:forms:contact-form
site:marketing:pricing
```

# 12. THEME ENGINE

Themes must be real React/TypeScript packages.

A theme must support:

- Theme manifest.
- Theme version.
- Templates.
- Layouts.
- Header.
- Footer.
- Navigation.
- Components.
- Global styles.
- Design tokens.
- Responsive configuration.
- Theme settings.
- Content templates.
- Theme assets.

Support:

- Theme installation.
- Theme activation.
- Theme configuration.
- Theme preview.
- Theme export.
- Theme import.
- Theme updates.
- Theme rollback.

A theme must not be allowed to alter core database structures directly.

Themes must use documented extension contracts.

Never assume that switching themes preserves every theme-specific component. Provide clear compatibility warnings.

# 13. PLUGIN PLATFORM

The plugin ecosystem is a core architectural requirement.

Plugins must be TypeScript packages with explicit manifests.

A plugin may contribute:

- Admin pages.
- Admin navigation.
- React components.
- Visual editor components.
- Custom content types.
- API endpoints.
- Webhooks.
- Background jobs.
- Settings.
- Integrations.
- Permissions.
- Server-side capabilities.

## Plugin manifest

Each plugin must declare:

- Unique identifier.
- Name.
- Version.
- Description.
- Author.
- Platform compatibility.
- Dependencies.
- Permissions.
- Extension points.
- Entry points.
- Configuration schema.

## Security boundary

Never assume that JavaScript Worker threads provide a security sandbox.

Never execute untrusted third-party plugin code inside the privileged CMS server process.

Use a narrow capability-based RPC interface for plugin operations.

Untrusted backend plugins must execute outside the privileged core process, using an isolated execution environment.

Plugin workers must not receive unrestricted database credentials.

All privileged actions must pass through authorized platform APIs.

For frontend extensions:

- Validate manifests.
- Validate registered contributions.
- Apply strict Content Security Policy.
- Isolate untrusted extension interfaces where appropriate.
- Validate messages and payloads.
- Prevent arbitrary access to administrative session secrets.

## Plugin permissions

Use explicit capabilities.

Example:

```text
content.read
content.create
content.update
content.publish
media.read
media.upload
users.read
settings.read
settings.write
webhooks.register
```

Never grant all permissions automatically.

## Plugin lifecycle

Implement:

```text
DISCOVERED
VALIDATING
INSTALLED
DISABLED
ENABLED
UPDATING
FAILED
UNINSTALLED
```

Transitions must be explicit and auditable.

Plugin installation must validate dependencies and compatibility.

Plugin updates must support rollback where practical.

# 14. DEVELOPER SDK

Build a documented TypeScript SDK.

Public SDK capabilities must include:

- Component registration.
- Editor control registration.
- Theme registration.
- Plugin registration.
- Admin extension registration.
- Content type registration.
- Permission declaration.
- API integration.
- Webhook registration.
- Background job registration.
- Settings registration.
- Logging.
- Platform API access.

Do not expose internal database implementation details as the public SDK.

Use stable public contracts.

Version the SDK independently from internal implementation.

Generate types from public schemas wherever practical.

Provide starter templates and working examples.

# 15. API PLATFORM

Implement a versioned REST API.

Use OpenAPI documentation.

Required API capabilities:

- Authentication.
- Authorization.
- Content CRUD.
- Content publishing.
- Custom content types.
- Taxonomies.
- Media.
- Themes.
- Plugins.
- User management.
- Site configuration.
- Webhooks.

Every endpoint must have:

- Input validation.
- Authentication where required.
- Permission checks.
- Consistent error responses.
- Pagination where applicable.
- Appropriate HTTP status codes.
- Automated tests.

Never rely on frontend validation as a security control.

GraphQL is a later optional subsystem. Do not delay the core platform to implement it.

# 16. AUTHENTICATION AND AUTHORIZATION

Implement secure authentication with adapter-based extensibility.

Required capabilities:

- Login.
- Logout.
- Session management.
- Password recovery.
- User invitations.
- Role management.
- Permission management.
- API tokens.
- Multi-factor authentication.
- Session revocation.
- Audit events.

Use secure session handling.

Apply CSRF protection where required.

Hash passwords using a modern password hashing algorithm.

Never store plaintext passwords.

Never store raw authentication secrets in client-accessible settings.

Authorization must be enforced on every protected server operation.

Use deny-by-default authorization.

# 17. MEDIA SYSTEM

Implement a storage adapter architecture.

Initial adapters:

1. Local filesystem.
2. S3-compatible object storage.

Media functionality:

- Upload.
- Download.
- Delete.
- Rename.
- Metadata.
- Alt text.
- Folders.
- Collections.
- Image transformations.
- Responsive image generation.
- MIME validation.
- File size limits.
- Duplicate detection.
- Storage usage tracking.

Validate file signatures where applicable.

Do not trust filenames or client-supplied MIME types.

Do not execute uploaded files.

# 18. ADMINISTRATION UI / UX

The administration application must look and feel like premium commercial software.

Visual quality is a release requirement.

Reference products:

- Linear.
- Stripe.
- Vercel.
- Raycast.
- Framer.
- Figma.
- Notion.

These are quality references, not templates to copy.

## Design philosophy

The interface must be:

- Precise.
- Sophisticated.
- Consistent.
- Fast.
- Accessible.
- Information-dense where appropriate.
- Visually restrained.
- Intuitive.
- Responsive.

Avoid generic AI-generated dashboard design.

Avoid:

- Excessive cards.
- Unnecessary gradients.
- Decorative borders.
- Excessive glassmorphism.
- Oversized headings.
- Random spacing.
- Inconsistent corner radii.
- Unnecessary floating panels.
- Decorative charts without useful data.
- Unnecessary animations.
- Generic icon combinations.
- Placeholder content.

## Design system

Create a centralized design system before building extensive application screens.

Define:

- Typography scale.
- Font weights.
- Color tokens.
- Surface tokens.
- Border tokens.
- Spacing scale.
- Radius scale.
- Shadows.
- Elevation.
- Motion tokens.
- Focus states.
- Responsive breakpoints.

All shared UI components must consume these tokens.

Do not introduce arbitrary colors and spacing values across individual features.

## Required components

Build reusable primitives:

- Button.
- Icon button.
- Input.
- Textarea.
- Select.
- Combobox.
- Checkbox.
- Radio.
- Switch.
- Dialog.
- Drawer.
- Dropdown.
- Context menu.
- Tooltip.
- Tabs.
- Popover.
- Toast.
- Command palette.
- Data table.
- Tree view.
- Breadcrumb.
- Pagination.
- Empty state.
- Loading state.
- Error state.
- Skeleton.
- Form controls.

Components must support keyboard interaction and accessibility.

## Interaction quality

Every interactive control must have:

- Hover state.
- Focus state.
- Active state.
- Disabled state.
- Loading state where applicable.
- Clear feedback.

Animations must communicate state changes.

Do not animate purely for decoration.

Support reduced-motion preferences.

# 19. ACCESSIBILITY

Target WCAG 2.2 AA.

Requirements:

- Semantic HTML.
- Keyboard accessibility.
- Visible focus.
- Screen-reader labels.
- Correct dialog focus management.
- Accessible forms.
- Accessible validation messages.
- Sufficient contrast.
- Reduced-motion support.
- Proper heading hierarchy.

Do not ship controls that cannot be operated with a keyboard.

# 20. SEO AND RENDERING

The platform must support:

- Server-side rendering.
- Static rendering.
- Incremental revalidation.
- Dynamic routes.
- Metadata.
- Canonical URLs.
- XML sitemaps.
- Robots.txt.
- Open Graph.
- Structured data.
- Redirects.
- Responsive images.
- Caching.

Keep rendering concerns separate from CMS content storage.

Use appropriate cache invalidation after publishing or modifying content.

Do not serve stale published content indefinitely.

# 21. WORDPRESS MIGRATION

Create a dedicated migration subsystem.

Initial support:

- WordPress XML export.
- Posts.
- Pages.
- Authors.
- Categories.
- Tags.
- Media.
- Custom post types where supported.
- Metadata where supported.

Migration workflow:

1. Upload source export.
2. Parse and validate.
3. Generate import preview.
4. Map users and content types.
5. Detect duplicate slugs.
6. Import media.
7. Import content.
8. Preserve relationships.
9. Generate redirects.
10. Produce migration report.

Migration must be retryable where practical.

Do not silently discard unsupported fields.

Clearly report unsupported content.

# 22. E-COMMERCE

Implement as a modular subsystem after the core CMS and plugin platform are stable.

Required capabilities:

- Products.
- Variants.
- Product categories.
- Inventory.
- Pricing.
- Discounts.
- Orders.
- Customers.
- Shipping adapters.
- Tax adapters.
- Payment adapters.

Do not implement payment processing from scratch.

Never store raw payment card information.

All financial operations must be server-side and auditable.

# 23. DEVELOPER CLI

Create a command-line tool named `platform`.

Required commands:

```bash
platform create <name>
platform dev
platform build
platform start
platform doctor
platform migrate
platform db status

platform plugin create <name>
platform plugin validate
platform plugin test
platform plugin package
platform plugin install <package>

platform theme create <name>
platform theme validate
platform theme package

platform content export
platform content import

platform deploy
```

CLI requirements:

- Helpful error messages.
- Predictable exit codes.
- Interactive prompts where useful.
- Non-interactive mode.
- Configuration validation.
- Progress reporting.
- Cross-platform support.

Do not create commands that simply print success without performing their advertised operations.

# 24. AI INTEGRATION

AI is optional.

The platform must work completely without AI.

Use provider adapters.

Support:

- Local Ollama.
- OpenAI-compatible APIs.
- Other provider integrations through adapters.

Potential features:

- Generate page layouts.
- Generate content.
- Generate React components.
- Suggest SEO improvements.
- Review accessibility.
- Suggest design improvements.
- Assist migration.

AI-generated changes must be previewable before applying.

Never allow AI to publish or execute privileged changes without explicit authorization.

# 25. TESTING REQUIREMENTS

Use Vitest for unit and integration testing.

Use Playwright for end-to-end testing.

Use React Testing Library for UI behavior.

Required testing categories:

**Unit**

- Validation.
- Permissions.
- Content operations.
- Document model.
- Component metadata.
- Plugin manifests.

**Integration**

- Database repositories.
- Authentication.
- API endpoints.
- Content publishing.
- Media uploads.
- Plugin lifecycle.

**End-to-end**

- Administrator login.
- Site creation.
- Page creation.
- Content editing.
- Publishing.
- Visual editing.
- Theme activation.
- Plugin installation.
- Permission enforcement.

**Security**

- Unauthorized access.
- Cross-site data access.
- Invalid plugin manifests.
- Permission escalation.
- Malformed requests.
- File upload abuse.

Every bug fix should include a regression test where practical.

# 26. ERROR HANDLING AND OBSERVABILITY

Implement centralized structured logging.

Use consistent error categories.

Never expose stack traces, secrets, or database internals to end users.

Track:

- Request failures.
- Database failures.
- Publishing failures.
- Plugin failures.
- Background job failures.
- Authentication failures.
- Storage failures.

Provide actionable administrative error messages.

Never swallow exceptions silently.

# 27. PERFORMANCE REQUIREMENTS

Prioritize performance throughout development.

Requirements:

- Server-side data fetching where appropriate.
- Small client-side bundles.
- Lazy loading.
- Pagination.
- Indexed database queries.
- Efficient media handling.
- Appropriate caching.
- Optimized rendering.
- Avoid unnecessary re-renders.
- Avoid unnecessary client-side JavaScript.

Do not load the entire CMS database into the browser.

Do not load every registered component when only a small subset is needed.

The visual editor must remain responsive with large documents.

Establish performance benchmarks before optimization work.

# 28. SECURITY REQUIREMENTS

Security is a core product feature.

Implement:

- Authentication.
- Authorization.
- Tenant isolation.
- CSRF protections.
- Input validation.
- Output escaping.
- Rate limiting.
- Secure sessions.
- Secret management.
- Audit logging.
- Upload validation.
- Dependency auditing.
- Plugin permission enforcement.
- Secure defaults.

Treat all external input as untrusted.

This includes:

- User content.
- Plugin packages.
- Theme packages.
- Uploaded files.
- Webhook payloads.
- Imported WordPress content.
- API requests.

Never trust a plugin simply because it is written in TypeScript.

# 29. IMPLEMENTATION WORKFLOW

Follow this process for every implementation task.

## Step 1 — Inspect

Inspect:

- Existing repository.
- Package structure.
- Existing functionality.
- Dependencies.
- Tests.
- Configuration.
- Architecture documentation.

Do not assume the repository is empty.

Do not overwrite existing work without inspecting it.

## Step 2 — Plan

Before making substantial changes:

- Define the feature.
- Identify affected packages.
- Define public interfaces.
- Identify database changes.
- Identify security implications.
- Identify dependencies.
- Define acceptance criteria.

## Step 3 — Implement

Implement the complete vertical slice.

A vertical slice includes:

- Database.
- Backend.
- Validation.
- Authorization.
- API.
- Frontend.
- Tests.
- Documentation.

Do not implement disconnected UI first and postpone the actual functionality indefinitely.

## Step 4 — Verify

Run the relevant commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
```

Run Playwright tests for affected critical workflows.

Fix errors introduced by your changes.

Never claim successful verification without running the checks.

## Step 5 — Report

At completion report:

- What was implemented.
- Files and packages changed.
- Database migrations added.
- Tests executed.
- Build results.
- Known limitations.
- Remaining work.

Distinguish implemented, partially implemented, and planned functionality.

# 30. DEVELOPMENT PHASES

Work sequentially.

Do not attempt to build the entire platform in one uncontrolled implementation pass.

## PHASE 0 — Repository and Architecture

Deliver:

- Monorepo.
- Workspace configuration.
- Turborepo.
- TypeScript configuration.
- Linting.
- Formatting.
- Testing infrastructure.
- Docker development environment.
- Environment configuration.
- Architecture documentation.
- CI pipeline.

Acceptance:
The repository installs, builds, typechecks, and tests successfully.

## PHASE 1 — Platform Foundation

Deliver:

- Core contracts.
- PostgreSQL.
- Drizzle schema.
- Database migrations.
- Authentication.
- User management.
- Workspace management.
- Site management.
- Roles.
- Permissions.
- Audit logging.
- API foundation.

Acceptance:
An administrator can create a site, manage users, and securely access the platform.

## PHASE 2 — CMS

Deliver:

- Content types.
- Pages.
- Posts.
- Taxonomies.
- Content relationships.
- Content editor.
- Media management.
- Revisions.
- Publishing.
- REST API.

Acceptance:
A complete content-driven website can be managed through the CMS.

## PHASE 3 — Rendering and Themes

Deliver:

- Theme manifest.
- Theme registry.
- React rendering.
- Templates.
- Layouts.
- Navigation.
- Global design tokens.
- Preview.
- SSR.
- Static rendering.
- Cache invalidation.

Acceptance:
CMS-managed content renders on a real Next.js website using an independently developed React theme.

## PHASE 4 — Visual Studio

Deliver:

- Structured document engine.
- Component registry.
- Visual canvas.
- Drag-and-drop.
- Selection.
- Layer tree.
- Property inspector.
- Responsive editing.
- Undo/redo.
- Autosave.
- Preview.
- Publishing.

Acceptance:
A non-developer can build and publish a complete website visually.

## PHASE 5 — Extension Ecosystem

Deliver:

- Plugin manifest.
- Plugin SDK.
- Component extensions.
- Admin extensions.
- API extensions.
- Permission declarations.
- Plugin lifecycle.
- Plugin validation.
- Isolated execution architecture.
- Example plugins.

Acceptance:
A developer can build and install a working extension without modifying platform core code.

## PHASE 6 — Advanced Capabilities

Deliver:

- WordPress migration.
- Webhooks.
- Advanced SEO.
- Background jobs.
- Multilingual content.
- Commerce foundation.
- Advanced integrations.
- Optional AI adapters.

Acceptance:
The platform supports representative production business websites and application use cases.

## PHASE 7 — Release Qualification

Deliver:

- Security review.
- Performance benchmarks.
- Accessibility audit.
- Database backup and restore.
- Migration testing.
- Documentation.
- Deployment guide.
- Upgrade procedure.
- Release automation.

Acceptance:
A clean installation can be deployed and operated independently by an external developer.

# 31. DEFINITION OF DONE

A feature is only complete when:

- Its implementation exists.
- Its data persists correctly.
- Its API works.
- Authorization is enforced.
- Validation works.
- Error handling exists.
- Loading and empty states exist.
- Automated tests pass.
- TypeScript checks pass.
- Documentation is updated.
- The actual workflow has been verified.

A visual placeholder is not a completed feature.

A mocked API is not a completed feature.

An in-memory implementation is not a completed persistent feature.

A button without its advertised behavior is not a completed feature.

# 32. FIRST ASSIGNMENT

Do not immediately begin building the entire CMS.

Start by examining the repository.

Then execute PHASE 0.

Your first deliverable must be a functioning development foundation.

Specifically:

1. Inspect the existing project and preserve useful work.
2. Establish the monorepo structure.
3. Configure pnpm and Turborepo.
4. Configure TypeScript strict mode.
5. Configure linting and formatting.
6. Configure testing.
7. Establish environment configuration.
8. Establish Docker-based PostgreSQL development.
9. Create architecture documentation.
10. Establish CI checks.
11. Verify clean installation.
12. Verify lint, typecheck, tests, and build.

After Phase 0, present the architecture and implementation report.

Do not silently proceed through all seven phases.

Wait for the next implementation assignment after reporting the foundation.

# FINAL DIRECTIVE

Build a platform that developers would genuinely choose over WordPress.

Do not optimize for the number of features shown in a dashboard.

Optimize for architectural quality, developer experience, extensibility, usability, performance, and reliability.

The visual experience must be exceptional.

The engineering underneath it must be equally exceptional.

**Build real software. Preserve architectural discipline. Never fake completion.**

# MANDATORY AGENT EXECUTION DIRECTIVE

Reading this file alone does not authorize implementation or remote repository
writes. Begin Phase 0 only when the user gives an explicit implementation
assignment. Commit or push changes only with task-level authorization.

**Your immediate assignment is PHASE 0 — Repository and Architecture.**

You must:

1. Inspect the existing repository before changing anything.
2. Understand the existing codebase and preserve useful implementations.
3. Execute every Phase 0 requirement.
4. Create and verify the actual files, configurations, scripts, and infrastructure.
5. Run linting, typechecking, tests, and production builds.
6. Fix errors introduced by your implementation.
7. Produce a detailed implementation report.

**Execution boundaries:**

- Execute Phase 0 only.
- Do not begin Phase 1 or subsequent phases.
- Do not generate placeholder implementations for future phases.
- Do not stop at planning or architecture documentation.
- Do not ask the user for permission to execute Phase 0.
- Do not claim completion without verification.

When Phase 0 is complete, stop all implementation work and report the results.

Wait for the user's next assignment before proceeding to Phase 1.

This instruction is mandatory and takes precedence over any assumption that all phases should be implemented immediately.

## GitHub Workflow — Mandatory

Before implementation, read `GIT-WORKFLOW.md`.

Every completed and successfully verified task must follow its
inspect → implement → verify → review → commit → push → remote verification
workflow.

Automatically commit and push authorized work to the current working
branch after successful verification.

Never force-push, bypass failing checks, overwrite unrelated changes,
or merge/publish releases without explicit authorization.
