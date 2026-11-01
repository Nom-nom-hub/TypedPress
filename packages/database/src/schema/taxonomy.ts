import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

import { contentEntries } from './content.js';
import { sites } from './identity.js';

export const taxonomies = pgTable(
  'taxonomies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('taxonomies_site_id_idx').on(table.siteId),
    uniqueIndex('taxonomies_site_id_id_uidx').on(table.siteId, table.id),
    uniqueIndex('taxonomies_site_id_slug_uidx').on(table.siteId, table.slug),
  ],
);

export const taxonomyTerms = pgTable(
  'taxonomy_terms',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'restrict' }),
    taxonomyId: uuid('taxonomy_id')
      .notNull()
      .references(() => taxonomies.id, { onDelete: 'restrict' }),
    parentId: uuid('parent_id'),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('taxonomy_terms_site_id_idx').on(table.siteId),
    index('taxonomy_terms_taxonomy_id_idx').on(table.taxonomyId),
    uniqueIndex('taxonomy_terms_site_id_id_uidx').on(table.siteId, table.id),
    uniqueIndex('taxonomy_terms_taxonomy_id_id_uidx').on(table.taxonomyId, table.id),
    uniqueIndex('taxonomy_terms_taxonomy_id_slug_uidx').on(table.taxonomyId, table.slug),
  ],
);

export const contentEntryTerms = pgTable(
  'content_entry_terms',
  {
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'restrict' }),
    contentEntryId: uuid('content_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'restrict' }),
    taxonomyTermId: uuid('taxonomy_term_id')
      .notNull()
      .references(() => taxonomyTerms.id, { onDelete: 'restrict' }),
  },
  (table) => [
    uniqueIndex('content_entry_terms_entry_term_uidx').on(
      table.contentEntryId,
      table.taxonomyTermId,
    ),
  ],
);
