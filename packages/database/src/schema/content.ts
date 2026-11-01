import { index, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { sites, users } from './identity.js';

export const contentTypes = pgTable(
  'content_types',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    schemaVersion: integer('schema_version').notNull().default(1),
    fieldSchema: jsonb('field_schema').notNull().default({}),
    settings: jsonb('settings'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('content_types_site_id_idx').on(table.siteId)],
);

export const contentEntries = pgTable(
  'content_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    contentTypeId: uuid('content_type_id')
      .notNull()
      .references(() => contentTypes.id, { onDelete: 'restrict' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    slug: varchar('slug', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).notNull().default('draft'),
    title: varchar('title', { length: 500 }),
    currentRevisionId: uuid('current_revision_id'),
    publishedRevisionId: uuid('published_revision_id'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('content_entries_site_id_idx').on(table.siteId), index('content_entries_status_idx').on(table.status)],
);

export const contentRevisions = pgTable(
  'content_revisions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    contentEntryId: uuid('content_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'cascade' }),
    revisionNumber: integer('revision_number').notNull(),
    changeSummary: text('change_summary'),
    data: jsonb('data').notNull().default({}),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('content_revisions_entry_id_idx').on(table.contentEntryId)],
);

export const taxonomies = pgTable(
  'taxonomies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('taxonomies_site_id_idx').on(table.siteId)],
);

export const taxonomyTerms = pgTable(
  'taxonomy_terms',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    taxonomyId: uuid('taxonomy_id')
      .notNull()
      .references(() => taxonomies.id, { onDelete: 'cascade' }),
    parentId: uuid('parent_id'),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('taxonomy_terms_site_id_idx').on(table.siteId)],
);

export const contentEntryTerms = pgTable(
  'content_entry_terms',
  {
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    contentEntryId: uuid('content_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'cascade' }),
    taxonomyTermId: uuid('taxonomy_term_id')
      .notNull()
      .references(() => taxonomyTerms.id, { onDelete: 'cascade' }),
  },
);

export const contentRelationships = pgTable(
  'content_relationships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    sourceEntryId: uuid('source_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'cascade' }),
    targetEntryId: uuid('target_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'cascade' }),
    relationType: varchar('relation_type', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('content_relationships_site_id_idx').on(table.siteId)],
);

export const mediaAssets = pgTable(
  'media_assets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    originalName: varchar('original_name', { length: 500 }).notNull(),
    storageKey: varchar('storage_key', { length: 1000 }).notNull().unique(),
    mimeType: varchar('mime_type', { length: 255 }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    altText: text('alt_text'),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('media_assets_site_id_idx').on(table.siteId)],
);