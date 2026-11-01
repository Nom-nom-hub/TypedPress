import { index, jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { sites, users } from './identity.js';

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 255 }).notNull(),
    resourceType: varchar('resource_type', { length: 255 }).notNull(),
    resourceId: uuid('resource_id'),
    metadata: jsonb('metadata').notNull().default({}),
    requestId: varchar('request_id', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('audit_logs_site_id_idx').on(table.siteId),
    index('audit_logs_actor_user_id_idx').on(table.actorUserId),
  ],
);
