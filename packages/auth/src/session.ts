import { createHash, randomBytes } from 'node:crypto';

import { createDatabaseClientFromConfig, type DatabaseClient } from '@typedpress/database';
import { sessions, users } from '@typedpress/database';
import { eq } from 'drizzle-orm';

export interface CreatedSession {
  readonly token: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(
  database: DatabaseClient['db'],
  userId: string,
  ttlMs = 30 * 24 * 60 * 60 * 1000,
): Promise<CreatedSession> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + ttlMs);

  await database.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return { token, tokenHash, expiresAt };
}

export async function resolveSession(database: DatabaseClient['db'], token: string) {
  const tokenHash = hashSessionToken(token);
  const [session] = await database
    .select()
    .from(sessions)
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);

  if (!session) {
    return null;
  }

  const now = new Date();
  if (session.expiresAt <= now) {
    await database.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
    return null;
  }

  const [user] = await database.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user || user.status !== 'active') {
    return null;
  }

  return { session, user };
}

export async function revokeSession(database: DatabaseClient['db'], token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  await database.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export { createDatabaseClientFromConfig };
