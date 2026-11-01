import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { sites, users } from './identity.js';
import { contentEntries } from './content.js';

export const contentRevisions = pgTable(
  'content_revisions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'restrict' }),
    contentEntryId: uuid('content_entry_id')
      .notNull()
      .references(() => contentEntries.id, { onDelete: 'restrict' }),
    revisionNumber: integer('revision_number').notNull(),
    changeSummary: text('change_summary'),
    data: jsonb('data').notNull().default({}),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('content_revisions_entry_id_idx').on(table.contentEntryId),
    uniqueIndex('content_revisions_entry_revision_uidx').on(
      table.contentEntryId,
      table.revisionNumber,
    ),
    uniqueIndex('content_revisions_entry_id_id_uidx').on(table.contentEntryId, table.id),
  ],
);
