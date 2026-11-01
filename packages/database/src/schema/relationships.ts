import {
  foreignKey,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { sites } from './identity.js';
import { contentEntries } from './content.js';

export const contentRelationships = pgTable(
  'content_relationships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'restrict' }),
    sourceEntryId: uuid('source_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'restrict' }),
    targetEntryId: uuid('target_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'restrict' }),
    relationType: varchar('relation_type', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('content_relationships_site_id_idx').on(table.siteId),
    uniqueIndex('content_relationships_site_id_id_uidx').on(table.siteId, table.id),
    foreignKey({
      columns: [table.siteId, table.sourceEntryId],
      foreignColumns: [contentEntries.siteId, contentEntries.id],
      name: 'content_relationships_site_source_fk',
    }),
    foreignKey({
      columns: [table.siteId, table.targetEntryId],
      foreignColumns: [contentEntries.siteId, contentEntries.id],
      name: 'content_relationships_site_target_fk',
    }),
  ],
);
