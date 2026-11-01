# PRD — Project [Working Name]

## A TypeScript-Native Website, CMS & Application Platform

**Product category:** Website infrastructure / CMS / Visual Development Platform  
**Product vision:** Build the next generation of WordPress, without PHP.  
**Primary technologies:** TypeScript, React, Next.js, Node.js  
**Deployment philosophy:** Open-source core, self-hosted first, optional managed hosting.

---

# 1. Executive Summary

Build a complete website and application platform designed around the modern TypeScript ecosystem.

The platform combines the capabilities of:

- WordPress — Content management, publishing, themes, plugins, users.
- Webflow — Visual website design and responsive editing.
- Next.js — Modern application development and server-side rendering.
- Shopify — Commerce and product management.
- Sanity / Payload — Structured content and developer-friendly APIs.

The product must not simply reproduce WordPress with a different programming language.

It must introduce a fundamentally better architecture for building, managing, extending, and deploying websites.

The platform must support both developers and non-technical website owners.

Developers should have complete access to source code, APIs, components, hooks, database schemas, and extension interfaces.

Non-developers should be able to create sophisticated websites through a visual editing environment without writing code.

# 2. Product Objectives

## Primary objectives

1. Replace PHP-based website development with TypeScript-native development.
2. Provide a complete CMS with sophisticated content management.
3. Introduce a visual React component editor.
4. Establish a standardized TypeScript plugin ecosystem.
5. Support custom themes and reusable component libraries.
6. Support traditional websites and complex web applications.
7. Provide self-hosted deployment without mandatory subscriptions.
8. Make WordPress migration practical.
9. Provide a developer-first CLI and SDK.
10. Establish an architecture capable of supporting a large extension ecosystem.

## Non-objectives

The initial release will not attempt to:

- Reproduce every WordPress plugin.
- Build an entire cloud hosting infrastructure.
- Become a proprietary website hosting service.
- Restrict developers to a proprietary component language.
- Require AI for ordinary website creation.
- Require users to use a visual editor.

# 3. Product Architecture

The platform consists of six major subsystems.

### A. Core CMS

The content management engine.

### B. Visual Studio

The visual website and component editor.

### C. Extension Runtime

The TypeScript plugin and integration ecosystem.

### D. Theme Engine

The rendering and website presentation system.

### E. Developer Platform

CLI, SDK, APIs, local development, testing, and deployment tools.

### F. Deployment Infrastructure

Self-hosted installation, build pipelines, environment configuration, and production deployment.

These subsystems must have clearly defined interfaces and must not become one tightly coupled application.

# 4. Core CMS

The CMS must provide functionality comparable to a mature WordPress installation.

## Content management

- Pages
- Blog posts
- Custom post types
- Custom content types
- Categories
- Tags
- Custom taxonomies
- Content relationships
- Reusable content blocks
- Content revisions
- Drafts
- Scheduled publishing
- Publishing workflows
- Content approval
- Content localization
- Content version history
- Scheduled content expiration

## Custom content types

Users must be able to create custom content structures without writing database migrations manually.

Example:

A real estate website can create:

Property:

- Title
- Description
- Price
- Address
- Bedrooms
- Bathrooms
- Images
- Property status
- Agent relationship

These structures must be accessible through the visual editor, APIs, and developer SDK.

## Media management

- Image uploads
- Video uploads
- Documents
- Image transformations
- Responsive image generation
- Media metadata
- Alt text
- Folders and collections
- Asset search
- Duplicate detection
- Storage adapters
- CDN integration

## Content editor

Provide a block-based content editor supporting:

- Rich text
- Headings
- Images
- Galleries
- Videos
- Tables
- Embeds
- Custom React blocks
- Reusable content sections
- Drag-and-drop ordering

Content must remain structured and portable.

# 5. Visual Website Studio

This is one of the platform's most important differentiators.

Build a professional visual website editor.

## Editor interface

Three primary working areas:

**Left sidebar**

- Pages
- Components
- Sections
- Templates
- Assets
- Global styles
- Extensions

**Center workspace**

- Live website canvas
- Drag-and-drop editing
- Component selection
- Responsive previews
- Visual layout editing
- Page navigation
- Zoom controls

**Right inspector**

- Component properties
- Typography
- Colors
- Spacing
- Borders
- Layout
- Responsive behavior
- Component-specific settings
- Advanced configuration

## Visual editing capabilities

- Drag and drop React components.
- Create sections and layouts.
- Configure component properties.
- Edit text directly on the canvas.
- Upload and replace images.
- Configure responsive breakpoints.
- Edit global design tokens.
- Create reusable components.
- Create reusable page sections.
- Manage component relationships.
- Preview pages without publishing.
- Undo and redo.
- Autosave.
- Version history.

## Responsive design

Support:

- Desktop
- Laptop
- Tablet
- Mobile

Users must be able to configure styles and layouts independently at each breakpoint.

## Critical architectural requirement

The visual editor must manipulate a structured component document, not attempt to reverse-engineer arbitrary React source code.

React components should expose editable metadata and property schemas.

Example:

```tsx
import { defineComponent } from '@platform/sdk';

export default defineComponent({
  name: 'HeroSection',

  label: 'Hero Section',

  category: 'Sections',

  props: {
    title: {
      type: 'string',
      label: 'Heading',
      default: 'Build Something Amazing',
    },

    subtitle: {
      type: 'string',
      label: 'Description',
    },

    buttonText: {
      type: 'string',
      label: 'Button Text',
    },
  },

  render: HeroSection,
});
```

The visual editor reads the component metadata and generates the appropriate property controls.

Developers retain control over the actual React implementation.

# 6. React Theme Engine

Themes must be actual TypeScript and React packages.

A theme should define:

- Global layout
- Navigation
- Headers
- Footers
- Typography
- Color systems
- Page templates
- Content templates
- Component collections
- Responsive behavior
- Theme configuration
- Global design tokens

## Theme requirements

- Install themes.
- Create themes.
- Duplicate themes.
- Edit themes.
- Export themes.
- Import themes.
- Switch themes.
- Create child themes or theme extensions.
- Preview themes.
- Version themes.

Themes must not be limited to predefined visual templates.

A developer must be able to build an entire custom React presentation layer.

# 7. TypeScript Plugin Ecosystem

This is a critical product differentiator.

Plugins must be real TypeScript packages.

A plugin can provide multiple capabilities:

- Admin dashboard pages.
- React components.
- Visual editor integrations.
- Content types.
- Database migrations.
- API endpoints.
- Webhooks.
- Authentication integrations.
- Custom settings.
- Background jobs.
- Scheduled tasks.
- External integrations.
- Frontend functionality.

## Plugin architecture

Each plugin must have a manifest declaring:

- Name
- Version
- Description
- Author
- Dependencies
- Required platform version
- Permissions
- Admin navigation
- Extension points
- API contributions
- Database requirements

## Plugin security

Third-party extensions must never receive unrestricted server access by default.

Implement:

- Permission declarations.
- Explicit capability grants.
- Server-side isolation.
- Request validation.
- Input sanitization.
- Database access controls.
- Plugin signing and integrity checks.
- Dependency vulnerability scanning.
- Audit logging.
- Plugin installation approval.

Untrusted frontend extensions and untrusted backend extensions must be treated differently.

Backend extensions should use a controlled execution model, with isolated processes or another enforceable sandbox where appropriate.

## Plugin lifecycle

- Install
- Validate
- Configure
- Enable
- Disable
- Update
- Roll back
- Uninstall

Provide dependency resolution and compatibility checks.

# 8. Extension SDK

Create an official TypeScript SDK.

Developers must have access to standardized interfaces for:

- Registering components.
- Registering editor controls.
- Registering admin routes.
- Creating content types.
- Registering API endpoints.
- Registering hooks.
- Creating background jobs.
- Registering settings pages.
- Defining permissions.
- Accessing content.
- Accessing media.
- Registering integrations.

The SDK must provide complete TypeScript definitions and excellent editor autocomplete.

Include:

- Documentation.
- Examples.
- Starter templates.
- Testing utilities.
- Local plugin development.
- Type generation.
- Compatibility validation.

# 9. Developer Experience

Developer experience must be treated as a first-class product feature.

## CLI

Provide a CLI called `platform`.

Example commands:

```bash
platform create my-website

platform dev

platform build

platform start

platform plugin create my-plugin

platform theme create my-theme

platform plugin install example-plugin

platform plugin test

platform deploy
```

## Local development

Developers must be able to run the complete platform locally.

Provide:

- Local database.
- Development server.
- Hot module replacement.
- Component preview.
- Plugin hot reload where supported.
- Theme hot reload.
- API explorer.
- Database inspection.
- Structured logging.
- Development diagnostics.

No mandatory cloud account should be required for local development.

# 10. Application Framework

The platform must support more than content websites.

Developers should be able to build:

- SaaS applications.
- Business websites.
- Online stores.
- Membership platforms.
- Marketplaces.
- Dashboards.
- Customer portals.
- Documentation websites.
- Community platforms.
- Web applications.

Provide:

- Custom routes.
- Server-side functionality.
- API routes.
- Server actions where supported.
- Middleware.
- Authentication adapters.
- Database access.
- Background processing.
- Webhooks.
- Scheduled jobs.

## Framework architecture

Use Next.js as the primary application integration and rendering framework.

However, do not make the CMS database or content engine inseparable from Next.js.

The CMS should expose stable APIs so other React applications and frontend frameworks can integrate with it.

# 11. E-commerce

Build an extensible commerce subsystem.

Initial functionality:

- Products
- Product variants
- Categories
- Inventory
- Pricing
- Discounts
- Coupons
- Orders
- Customers
- Shipping configuration
- Tax integrations
- Payment provider integrations
- Order status management

Payment processing must use external payment providers through secure adapters.

Never store raw payment card information.

# 12. User Management and Security

Implement:

- User accounts
- Roles
- Permissions
- Custom roles
- Team management
- Invitations
- Password recovery
- Session management
- Multi-factor authentication
- Audit logs
- API tokens
- Access policies

Provide granular permissions for both administrators and plugin capabilities.

# 13. SEO and Performance

Built-in SEO functionality:

- Metadata editor
- Canonical URLs
- XML sitemaps
- Robots.txt
- Open Graph metadata
- Structured data
- Redirect management
- URL management
- Image optimization
- Automatic metadata defaults

Performance requirements:

- Server-side rendering.
- Static generation.
- Incremental revalidation where supported.
- Caching.
- Lazy loading.
- Responsive images.
- Optimized asset delivery.
- Database query optimization.

The platform must not sacrifice performance to support the visual editor.

# 14. WordPress Migration

Migration is essential for adoption.

Provide an import system supporting:

- WordPress XML exports.
- Posts.
- Pages.
- Categories.
- Tags.
- Media.
- Authors.
- Custom post types where mappings are available.
- Metadata where mappings are available.
- URL redirects.

Create a migration preview before importing.

Report:

- Successfully imported records.
- Unsupported content.
- Failed imports.
- Missing assets.
- Mapping conflicts.

Do not promise automatic compatibility with arbitrary WordPress plugins or PHP themes.

# 15. Administration Interface

The administration interface should feel like premium enterprise software.

Design references:

- Linear
- Vercel
- Stripe
- Raycast
- Notion

Design principles:

- Excellent typography.
- Consistent spacing.
- Precise alignment.
- Strong information hierarchy.
- Minimal visual noise.
- Functional animations.
- Excellent keyboard navigation.
- Accessible color contrast.
- Responsive layouts.
- Light and dark themes.

Avoid:

- Generic dashboard cards everywhere.
- Excessive gradients.
- Excessive glass effects.
- Unnecessary borders.
- Floating panels without functional purpose.
- Decorative charts without meaningful data.
- Inconsistent component styling.

Build a unified design system with reusable tokens and components.

# 16. Database Architecture

Use PostgreSQL as the primary database.

Use Drizzle ORM or an equivalent strongly typed database layer.

Core entities:

- Users
- Roles
- Permissions
- Sites
- Workspaces
- Pages
- Posts
- ContentTypes
- ContentEntries
- Taxonomies
- Media
- Themes
- Plugins
- PluginPermissions
- Revisions
- Redirects
- Settings
- APIKeys
- Webhooks
- AuditLogs

Custom content structures must be extensible without requiring every customer to modify core database tables manually.

Use a deliberate hybrid relational and JSONB content model where appropriate.

Implement migration versioning, transaction safety, backups, and restoration.

# 17. API Architecture

Provide:

**REST API**
For general application and integration development.

**GraphQL**
For flexible content querying where beneficial.

**Webhooks**
For publishing, updates, deletions, orders, and other platform events.

**TypeScript SDK**
For strongly typed application development.

API requirements:

- Authentication.
- Authorization.
- Rate limiting.
- Pagination.
- Filtering.
- Validation.
- Versioning.
- Error standards.
- OpenAPI documentation.

# 18. Deployment

Support:

- Docker.
- Docker Compose.
- Self-hosted Linux servers.
- Node.js environments.
- PostgreSQL.
- S3-compatible media storage.
- Reverse proxies.
- Custom domains.
- Environment-based configuration.

Provide a straightforward installation experience.

A user should be able to deploy the platform without purchasing proprietary hosting.

# 19. AI Integration (Optional Subsystem)

AI must enhance the platform, not become a requirement.

Potential capabilities:

- Generate page structures.
- Generate React components.
- Suggest website layouts.
- Generate content.
- Improve SEO metadata.
- Suggest accessibility improvements.
- Analyze design consistency.
- Assist with WordPress migration.
- Explain plugin errors.

Support provider adapters, including local model providers such as Ollama.

Users must be able to disable AI completely.

# 20. Initial Technology Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Language       | TypeScript                                |
| Frontend       | React                                     |
| Framework      | Next.js                                   |
| Styling        | Tailwind CSS                              |
| UI primitives  | Accessible component primitives           |
| Database       | PostgreSQL                                |
| ORM            | Drizzle                                   |
| Validation     | Zod                                       |
| API            | REST + optional GraphQL                   |
| Editor         | Structured React component document model |
| CLI            | Node.js                                   |
| Runtime        | Node.js                                   |
| Infrastructure | Docker                                    |
| Media          | S3-compatible storage                     |
| Testing        | Vitest + Playwright                       |
| Documentation  | TypeScript SDK documentation              |

Use stable releases available at implementation time. Do not pin the architecture to outdated framework versions.

# 21. Product Development Phases

## Phase 1 — Platform Foundation

Engineering phases in `AGENTS.md` split this work as Engineering Phase 0
(engineering foundation, monorepo, Docker, CI) and Engineering Phase 1
(platform foundation). Product Phase 1 includes both.

Deliver:

- Monorepo architecture.
- Core application.
- Database.
- Authentication.
- User management.
- Permission system.
- Site/workspace management.
- Settings infrastructure.
- CLI foundation.
- Docker development environment.

**Exit criteria:** A working local installation with persistent database storage and secure administrator access.

## Phase 2 — CMS Engine

Deliver:

- Pages.
- Posts.
- Custom content types.
- Content editor.
- Media library.
- Categories and tags.
- Revisions.
- Publishing.
- REST API.

**Exit criteria:** Users can create, manage, preview, and publish a complete content-driven website.

## Phase 3 — Theme and Rendering Engine

Deliver:

- React themes.
- Page templates.
- Content templates.
- Theme configuration.
- Server-side rendering.
- Static generation.
- Preview mode.
- Responsive rendering.

**Exit criteria:** Developers can build and deploy fully custom React websites using CMS content.

## Phase 4 — Visual Studio

Deliver:

- Visual canvas.
- Component registry.
- Component metadata.
- Drag-and-drop.
- Property inspector.
- Responsive editing.
- Reusable sections.
- Global styles.
- Undo/redo.
- Autosave.
- Preview and publishing.

**Exit criteria:** A non-developer can create and publish a professional website without writing code.

## Phase 5 — Plugin Ecosystem

Deliver:

- TypeScript SDK.
- Plugin manifests.
- Extension registry.
- Permission enforcement.
- Plugin lifecycle.
- Admin extension points.
- Component extensions.
- API extensions.
- Plugin testing tools.

**Exit criteria:** Independent developers can create, install, test, enable, disable, and distribute functional extensions.

## Phase 6 — Advanced Platform

Deliver:

- E-commerce.
- Advanced SEO.
- Webhooks.
- GraphQL.
- WordPress importer.
- Multilingual content.
- Advanced user permissions.
- Background jobs.
- Integrations.
- AI adapters.

**Exit criteria:** The platform can support real production websites and application use cases.

## Phase 7 — Ecosystem and Release

Deliver:

- Public documentation.
- Plugin marketplace.
- Theme marketplace.
- Starter templates.
- Migration guides.
- Production installation guide.
- Security audit.
- Performance testing.
- Backup and restoration testing.
- Release management.

**Exit criteria:** External developers can independently install, develop for, extend, and deploy the platform.

# 22. Non-Negotiable Engineering Requirements

1. TypeScript strict mode throughout the codebase.
2. No PHP dependencies.
3. No proprietary component markup language replacing React.
4. No tightly coupled CMS and rendering architecture.
5. No unrestricted third-party plugin execution.
6. No hardcoded website templates.
7. No mandatory cloud services.
8. No mandatory AI services.
9. No breaking changes to the extension API without versioning and migration support.
10. Every major subsystem must have automated tests.
11. Database migrations must be reversible where practical.
12. All user-facing features must have loading, empty, success, and error states.
13. Accessibility must be considered from the beginning.
14. Security and authorization must be enforced server-side.
15. Documentation must be delivered alongside functionality.

# 23. Definition of Success

The product is successful when:

- A user can install it on their own server.
- A user can create a complete website without coding.
- A developer can build a custom React website using its CMS.
- Developers can create TypeScript plugins.
- Plugins can contribute both backend and frontend functionality securely.
- Developers can build custom themes.
- Content can be managed independently of frontend implementation.
- Existing WordPress websites can be migrated.
- Websites can be deployed without proprietary hosting.
- The platform can support applications beyond traditional websites.

# 24. Product Positioning

**Category:** TypeScript-native web publishing and application platform.

**Positioning statement:**

A modern, extensible platform for building websites and web applications using the technologies developers already love.

WordPress made website publishing accessible to the world.

This platform aims to do the same for the modern TypeScript ecosystem.

**Core philosophy:**

Build visually. Develop without limits. Own your infrastructure. Extend everything.

---

# 25. Final Instruction to the Development Agent

Treat this document as the product specification, not a request to generate a visual prototype.

First establish the architecture, repository structure, subsystem boundaries, database design, extension contracts, and development workflow.

Then implement the product incrementally according to the development phases.

Do not attempt to implement all phases in one pass.

Before starting each phase:

1. Review existing architecture.
2. Identify dependencies.
3. Define implementation tasks.
4. Define acceptance criteria.
5. Implement functionality.
6. Write automated tests.
7. Verify the actual user experience.
8. Update technical documentation.
9. Report completed work and outstanding issues.

Do not replace real functionality with mock interfaces.

Do not mark features complete because a screen exists.

A feature is complete only when its backend, frontend, persistence, authorization, error handling, and tests work together.

Prioritize a reliable foundation over superficial feature count.

The ultimate objective is to create a credible, production-grade alternative to WordPress built around TypeScript and React.
