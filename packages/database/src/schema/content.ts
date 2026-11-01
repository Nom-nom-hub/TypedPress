import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { sites, users } from './identity.js';

export const contentTypes = pgTable(
  'content_types',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    schemaVersion: integer('schema_version').notNull().default(1),
    fieldSchema: jsonb('field_schema').notNull().default({}),
    settings: jsonb('settings'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('content_types_site_id_idx').on(table.siteId),
    uniqueIndex('content_types_site_id_id_uidx').on(table.siteId, table.id),
    uniqueIndex('content_types_site_id_slug_uidx').on(table.siteId, table.slug),
  ],
);

export const contentEntries = pgTable(
  'content_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'restrict' }),
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
  (table) => [
    index('content_entries_site_id_idx').on(table.siteId),
    index('content_entries_site_type_idx').on(table.siteId, table.contentTypeId),
    index('content_entries_site_status_idx').on(table.siteId, table.status),
    uniqueIndex('content_entries_site_id_id_uidx').on(table.siteId, table.id),
    uniqueIndex('content_entries_site_id_slug_uidx').on(table.siteId, table.slug),
  ],
);
