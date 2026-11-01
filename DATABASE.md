# DATABASE.md

# Database Architecture & Data Model

**Status:** Foundational data contract  
**Primary database:** PostgreSQL  
**ORM:** Drizzle ORM  
**Applies to:** `packages/database`, `packages/content`, `packages/auth`, `packages/permissions`, `packages/media`

## 1. Objective

Define a reliable relational data architecture for a multi-site TypeScript-native CMS and application platform.

The database must support:

- Multiple sites.
- Content management.
- Custom content types.
- Revisions.
- Publishing workflows.
- Users and permissions.
- Media.
- Themes.
- Plugins.
- Visual page documents.
- Audit history.
- Extensible application data.

## 2. Database Principles

1. PostgreSQL is the primary database.
2. Drizzle ORM manages schema definitions and migrations.
3. All schema changes must be version-controlled.
4. Use foreign keys where relationships require integrity.
5. Use transactions for multi-step writes.
6. Use JSONB for structured flexible data, not as a replacement for relational modeling.
7. Use indexes based on actual query patterns.
8. All site-owned records must be scoped to a site.
9. Authorization must be enforced in the service layer.
10. Never expose database credentials to clients.

## 3. Core Tables

### sites

Represents an independent website or application.

Fields:

- id: UUID primary key.
- name: text.
- slug: text.
- status: text.
- settings: JSONB.
- created_at: timestamp.
- updated_at: timestamp.

### site_domains

Fields:

- id: UUID.
- site_id: UUID foreign key.
- hostname: text.
- is_primary: boolean.
- verification_status: text.
- created_at: timestamp.

Hostname uniqueness and domain ownership must be enforced.

### users

Fields:

- id: UUID.
- email: text.
- password_hash: nullable text.
- display_name: text.
- status: text.
- created_at: timestamp.
- updated_at: timestamp.

Email uniqueness must follow a documented normalization policy.

### sessions

Fields:

- id: UUID.
- user_id: UUID.
- token_hash: text.
- expires_at: timestamp.
- created_at: timestamp.

Store session token hashes, not raw session tokens.

### roles

Fields:

- id: UUID.
- site_id: nullable UUID.
- name: text.
- description: nullable text.
- is_system: boolean.

### permissions

Fields:

- id: UUID.
- key: text.
- description: text.

### role_permissions

Fields:

- role_id: UUID.
- permission_id: UUID.

### user_site_roles

Fields:

- id: UUID.
- user_id: UUID.
- site_id: UUID.
- role_id: UUID.

Support platform-level roles separately from site-specific roles.

## 4. Content Management

### content_types

Defines custom content structures.

Fields:

- id: UUID.
- site_id: UUID.
- name: text.
- slug: text.
- description: nullable text.
- schema_version: integer.
- field_schema: JSONB.
- settings: JSONB.
- created_at: timestamp.
- updated_at: timestamp.

### content_entries

Represents logical content records.

Fields:

- id: UUID.
- site_id: UUID.
- content_type_id: UUID.
- slug: text.
- status: text.
- current_revision_id: nullable UUID.
- published_revision_id: nullable UUID.
- author_id: UUID.
- created_at: timestamp.
- updated_at: timestamp.

### content_revisions

Immutable content snapshots.

Fields:

- id: UUID.
- site_id: UUID.
- entry_id: UUID.
- revision_number: integer.
- data: JSONB.
- editor_id: UUID.
- change_summary: nullable text.
- created_at: timestamp.

Revisions must not be silently overwritten.

### content_taxonomies

Fields:

- id: UUID.
- site_id: UUID.
- name: text.
- slug: text.

### content_terms

Fields:

- id: UUID.
- site_id: UUID.
- taxonomy_id: UUID.
- name: text.
- slug: text.
- parent_id: nullable UUID.

### content_entry_terms

Fields:

- entry_id: UUID.
- term_id: UUID.

### scheduled_publications

Fields:

- id: UUID.
- site_id: UUID.
- entry_id: UUID.
- revision_id: UUID.
- scheduled_at: timestamp with time zone.
- status: text.
- created_at: timestamp.

Publishing jobs must be idempotent.

## 5. Page Builder

### pages

Fields:

- id: UUID.
- site_id: UUID.
- title: text.
- slug: text.
- status: text.
- current_revision_id: nullable UUID.
- published_revision_id: nullable UUID.
- created_at: timestamp.
- updated_at: timestamp.

### page_revisions

Fields:

- id: UUID.
- site_id: UUID.
- page_id: UUID.
- revision_number: integer.
- document: JSONB.
- schema_version: integer.
- editor_id: UUID.
- created_at: timestamp.

Page documents must be validated against the editor document schema before saving.

Do not store executable React components in the database.

## 6. Media Management

### media_assets

Fields:

- id: UUID.
- site_id: UUID.
- uploaded_by: UUID.
- filename: text.
- original_filename: text.
- mime_type: text.
- file_size: bigint.
- storage_key: text.
- width: nullable integer.
- height: nullable integer.
- metadata: JSONB.
- created_at: timestamp.

### media_variants

Fields:

- id: UUID.
- media_id: UUID.
- variant_name: text.
- storage_key: text.
- width: nullable integer.
- height: nullable integer.
- mime_type: text.
- file_size: bigint.

The database stores metadata and storage references, not binary file contents by default.

## 7. Themes

### themes

Fields:

- id: UUID.
- name: text.
- slug: text.
- version: text.
- manifest: JSONB.
- package_reference: text.
- created_at: timestamp.

### site_themes

Fields:

- id: UUID.
- site_id: UUID.
- theme_id: UUID.
- configuration: JSONB.
- is_active: boolean.
- activated_at: timestamp.

Theme packages must be versioned and validated.

## 8. Plugins

### plugins

Fields:

- id: UUID.
- name: text.
- slug: text.
- version: text.
- manifest: JSONB.
- package_reference: text.
- status: text.
- installed_at: timestamp.

### site_plugins

Fields:

- id: UUID.
- site_id: UUID.
- plugin_id: UUID.
- enabled: boolean.
- configuration: JSONB.
- installed_at: timestamp.

### plugin_permissions

Fields:

- id: UUID.
- plugin_id: UUID.
- capability: text.
- granted_at: nullable timestamp.
- granted_by: nullable UUID.

Plugin permissions must be explicit and auditable.

## 9. Audit Logging

### audit_logs

Fields:

- id: UUID.
- site_id: nullable UUID.
- actor_user_id: nullable UUID.
- action: text.
- resource_type: text.
- resource_id: nullable UUID.
- metadata: JSONB.
- request_id: nullable text.
- created_at: timestamp.

Audit logs must not contain secrets or raw authentication tokens.

## 10. Application Data Extensions

Provide a documented mechanism for application-specific tables and plugin-owned data.

Rules:

- Every plugin must declare its data ownership.
- Plugin migrations must be versioned.
- Plugin tables must use controlled namespaces.
- Plugins must not modify core tables directly.
- Plugin uninstall behavior must distinguish disabling from data deletion.
- Data deletion must require explicit policy and confirmation.

## 11. Multi-Tenancy and Isolation

The platform must support multiple sites within one installation.

Every site-owned resource must have a `site_id`.

Enforce site scope in repository and service operations.

Where appropriate, use PostgreSQL composite foreign keys to ensure related records belong to the same site.

Evaluate PostgreSQL row-level security as an additional defense, not as a substitute for service-layer authorization.

Never trust a site ID received from the browser without validating the user's access.

## 12. Data Integrity

Implement:

- Foreign keys.
- Unique constraints.
- Check constraints.
- Appropriate cascading rules.
- Transactional writes.
- Migration rollback strategy where feasible.

Avoid cascading deletion of published content, revisions, or media without an explicit deletion policy.

## 13. Indexing

At minimum, evaluate indexes for:

- Site IDs.
- Content type IDs.
- Content slugs.
- Content statuses.
- Publication timestamps.
- Revision lookup.
- Page slugs.
- User email.
- Session expiration.
- Domain hostnames.
- Media ownership.

Use composite indexes for frequent site-scoped queries.

Do not add indexes without understanding their write and storage costs.

## 14. Migration Standards

All migrations must:

- Be committed to version control.
- Have deterministic names.
- Be tested against a clean database.
- Be tested against an existing database.
- Avoid destructive changes without an explicit migration plan.
- Include data transformations where necessary.

Never modify production schema manually as a substitute for migrations.

## 15. Backup and Recovery

Document:

- Database backup.
- Database restore.
- Media backup.
- Migration recovery.
- Disaster recovery.
- Backup verification.

A database backup without corresponding media storage recovery is incomplete.

## 16. Acceptance Criteria

The database architecture is complete when:

- A site can be created.
- Users can be assigned site-specific roles.
- Custom content types can be defined.
- Entries can have immutable revisions.
- Content can be scheduled and published.
- Pages can store versioned editor documents.
- Media metadata can be stored.
- Themes and plugins can be installed and assigned.
- Site isolation is enforced.
- Migrations can initialize and upgrade a clean installation.
- Automated tests verify critical constraints.
