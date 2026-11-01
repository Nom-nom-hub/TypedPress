import http from 'node:http';

import { loadPlatformConfig } from '@typedpress/config';
import {
  contentEntries,
  contentRevisions,
  contentTypes,
  createDatabaseClientFromConfig,
  permissions,
  platformUserRoles,
  rolePermissions,
  roles,
  sites,
  users,
  workspaces,
} from '@typedpress/database';
import { hasPermission, platformPermissions } from '@typedpress/permissions';
import {
  hashPassword,
  verifyPassword,
  resolveSession,
  createSession,
  revokeSession,
} from '@typedpress/auth';
import { emailAddressSchema } from '@typedpress/validation';
import { createLogger } from '@typedpress/logger';
import { and, eq, isNull } from 'drizzle-orm';

const config = loadPlatformConfig();
const database = createDatabaseClientFromConfig(config);
const logger = createLogger();
const dummyPasswordHash = await hashPassword('typedpress-timing-safety-placeholder');

const loginAttempts = new Map<string, number[]>();
function checkLoginRateLimit(key: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const attempts = (loginAttempts.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  attempts.push(now);
  loginAttempts.set(key, attempts);
  return attempts.length > 5;
}

const MAX_REQUEST_BODY_BYTES = 1_000_000;

class RequestBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestBodyError';
  }
}

async function readJson(request: http.IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > MAX_REQUEST_BODY_BYTES) {
      throw new RequestBodyError('request body exceeds the maximum allowed size');
    }
    chunks.push(buffer);
  }
  if (chunks.length === 0) {
    return {};
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new RequestBodyError('request body must be valid JSON');
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new RequestBodyError('request body must be a JSON object');
  }
  return parsed as Record<string, unknown>;
}

function sendJson(response: http.ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function requireSession(request: http.IncomingMessage) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  return resolveSession(database.db, authorization.slice('Bearer '.length));
}

async function getGrantedPermissions(userId: string): Promise<string[]> {
  const rows = await database.db
    .select({ key: permissions.key })
    .from(platformUserRoles)
    .innerJoin(roles, eq(roles.id, platformUserRoles.roleId))
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, platformUserRoles.roleId))
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(and(eq(platformUserRoles.userId, userId), isNull(roles.siteId)));
  return rows.map((row) => row.key);
}

function publicUser(user: { id: string; email: string; displayName: string; status: string }) {
  return { id: user.id, email: user.email, displayName: user.displayName, status: user.status };
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const method = request.method ?? 'GET';

    if (url.pathname === '/health' && method === 'GET') {
      sendJson(response, 200, { status: 'ok' });
      return;
    }

    if (url.pathname === '/setup' && method === 'POST') {
      const existingUsers = await database.db.select({ id: users.id }).from(users).limit(1);
      if (existingUsers.length > 0) {
        sendJson(response, 409, { error: 'Platform already initialized' });
        return;
      }
      const body = await readJson(request);
      const configuredToken = process.env.PLATFORM_SETUP_TOKEN;
      const providedToken = String(body.setupToken ?? request.headers['x-setup-token'] ?? '');
      if (configuredToken) {
        if (providedToken !== configuredToken) {
          sendJson(response, 403, { error: 'Invalid setup token' });
          return;
        }
      } else {
        const remoteAddress = request.socket.remoteAddress ?? '';
        if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remoteAddress)) {
          sendJson(response, 403, {
            error: 'Setup is restricted to localhost unless PLATFORM_SETUP_TOKEN is configured',
          });
          return;
        }
      }

      const emailValidation = emailAddressSchema.safeParse(
        String(body.email ?? '')
          .trim()
          .toLowerCase(),
      );
      const password = String(body.password ?? '');
      const displayName = String(
        body.displayName ?? (emailValidation.success ? emailValidation.data : ''),
      );
      if (!emailValidation.success || !password) {
        sendJson(response, 400, { error: 'a valid email and password are required' });
        return;
      }
      const email = emailValidation.data;
      const passwordHash = await hashPassword(password);
      const [user] = await database.db
        .insert(users)
        .values({ email, passwordHash, displayName })
        .returning();
      if (!user) {
        sendJson(response, 500, { error: 'Failed to create user' });
        return;
      }

      const permissionRows = await Promise.all(
        platformPermissions.map(async (key) => {
          const [existing] = await database.db
            .select()
            .from(permissions)
            .where(eq(permissions.key, key))
            .limit(1);
          if (existing) return existing;
          const [created] = await database.db
            .insert(permissions)
            .values({ key, description: key })
            .returning();
          return created;
        }),
      );

      const [adminRole] = await database.db
        .insert(roles)
        .values({ name: 'platform-admin', isSystem: true, description: 'Platform administrator' })
        .returning();
      if (!adminRole) {
        sendJson(response, 500, { error: 'Failed to create admin role' });
        return;
      }

      await database.db.insert(rolePermissions).values(
        permissionRows
          .filter((permission): permission is NonNullable<typeof permission> => Boolean(permission))
          .map((permission) => ({
            roleId: adminRole.id,
            permissionId: permission.id,
          })),
      );
      await database.db.insert(platformUserRoles).values({
        userId: user.id,
        roleId: adminRole.id,
      });

      const session = await createSession(database.db, user.id);
      sendJson(response, 201, { user: publicUser(user), token: session.token });
      return;
    }

    if (url.pathname === '/auth/login' && method === 'POST') {
      const body = await readJson(request);
      const emailValidation = emailAddressSchema.safeParse(
        String(body.email ?? '')
          .trim()
          .toLowerCase(),
      );
      const password = String(body.password ?? '');
      if (!emailValidation.success || !password) {
        sendJson(response, 400, { error: 'a valid email and password are required' });
        return;
      }
      const email = emailValidation.data;
      const remoteAddress = request.socket.remoteAddress ?? '';
      if (checkLoginRateLimit(`${remoteAddress}:${email}`)) {
        sendJson(response, 429, { error: 'Too many login attempts' });
        return;
      }

      const [user] = await database.db.select().from(users).where(eq(users.email, email)).limit(1);
      const passwordHash = user?.passwordHash ?? dummyPasswordHash;
      const passwordMatches = await verifyPassword(password, passwordHash);
      if (!user || user.status !== 'active' || !user.passwordHash || !passwordMatches) {
        sendJson(response, 401, { error: 'Invalid credentials' });
        return;
      }
      const session = await createSession(database.db, user.id);
      sendJson(response, 200, { user: publicUser(user), token: session.token });
      return;
    }

    const authenticated = await requireSession(request);
    if (!authenticated) {
      sendJson(response, 401, { error: 'Authentication required' });
      return;
    }
    const grantedPermissions = await getGrantedPermissions(authenticated.user.id);

    if (url.pathname === '/users' && method === 'GET') {
      if (!hasPermission(grantedPermissions, 'platform.users.read')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const rows = await database.db
        .select({
          id: users.id,
          email: users.email,
          displayName: users.displayName,
          status: users.status,
        })
        .from(users);
      sendJson(response, 200, { users: rows });
      return;
    }

    if (url.pathname === '/users' && method === 'POST') {
      if (!hasPermission(grantedPermissions, 'platform.users.create')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const body = await readJson(request);
      const emailValidation = emailAddressSchema.safeParse(
        String(body.email ?? '')
          .trim()
          .toLowerCase(),
      );
      const password = String(body.password ?? '');
      const displayName = String(
        body.displayName ?? (emailValidation.success ? emailValidation.data : ''),
      );
      if (!emailValidation.success || !password) {
        sendJson(response, 400, { error: 'a valid email and password are required' });
        return;
      }
      const email = emailValidation.data;
      const passwordHash = await hashPassword(password);
      const [user] = await database.db
        .insert(users)
        .values({ email, passwordHash, displayName })
        .returning();
      if (!user) {
        sendJson(response, 500, { error: 'Failed to create user' });
        return;
      }
      sendJson(response, 201, { user: publicUser(user) });
      return;
    }
    if (url.pathname === '/workspaces' && method === 'GET') {
      if (!hasPermission(grantedPermissions, 'platform.workspaces.read')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const rows = await database.db.select().from(workspaces);
      sendJson(response, 200, { workspaces: rows });
      return;
    }

    if (url.pathname === '/workspaces' && method === 'POST') {
      if (!hasPermission(grantedPermissions, 'platform.workspaces.create')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const body = await readJson(request);
      const name = String(body.name ?? '');
      const slug = String(body.slug ?? '');
      if (!name || !slug) {
        sendJson(response, 400, { error: 'name and slug are required' });
        return;
      }
      const [workspace] = await database.db.insert(workspaces).values({ name, slug }).returning();
      sendJson(response, 201, { workspace });
      return;
    }

    if (url.pathname === '/sites' && method === 'GET') {
      if (!hasPermission(grantedPermissions, 'platform.sites.read')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const rows = await database.db.select().from(sites);
      sendJson(response, 200, { sites: rows });
      return;
    }

    if (url.pathname === '/sites' && method === 'POST') {
      if (!hasPermission(grantedPermissions, 'platform.sites.create')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const body = await readJson(request);
      const workspaceId = String(body.workspaceId ?? '');
      const name = String(body.name ?? '');
      const slug = String(body.slug ?? '');
      if (!workspaceId || !name || !slug) {
        sendJson(response, 400, { error: 'workspaceId, name, and slug are required' });
        return;
      }
      const [site] = await database.db
        .insert(sites)
        .values({ workspaceId, name, slug })
        .returning();
      sendJson(response, 201, { site });
      return;
    }

    if (url.pathname === '/auth/logout' && method === 'POST') {
      const authorization = request.headers.authorization;
      if (!authorization?.startsWith('Bearer ')) {
        sendJson(response, 401, { error: 'Authentication required' });
        return;
      }
      await revokeSession(database.db, authorization.slice('Bearer '.length));
      sendJson(response, 204, {});
      return;
    }

    if (url.pathname === '/content-types' && method === 'GET') {
      if (!hasPermission(grantedPermissions, 'content.types.read')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const siteId = url.searchParams.get('siteId');
      const rows = siteId
        ? await database.db.select().from(contentTypes).where(eq(contentTypes.siteId, siteId))
        : await database.db.select().from(contentTypes);
      sendJson(response, 200, { contentTypes: rows });
      return;
    }

    if (url.pathname === '/content-types' && method === 'POST') {
      if (!hasPermission(grantedPermissions, 'content.types.create')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const body = await readJson(request);
      const siteId = String(body.siteId ?? '');
      const name = String(body.name ?? '');
      const slug = String(body.slug ?? '');
      if (!siteId || !name || !slug) {
        sendJson(response, 400, { error: 'siteId, name, and slug are required' });
        return;
      }
      const [contentType] = await database.db
        .insert(contentTypes)
        .values({
          siteId,
          name,
          slug,
          description: body.description ? String(body.description) : null,
          fieldSchema:
            body.fieldSchema && typeof body.fieldSchema === 'object' ? body.fieldSchema : {},
          settings: body.settings && typeof body.settings === 'object' ? body.settings : null,
        })
        .returning();
      sendJson(response, 201, { contentType });
      return;
    }

    const contentEntryMatch = url.pathname.match(/^\/content-entries\/([^/]+)$/);
    if (contentEntryMatch && method === 'GET') {
      if (!hasPermission(grantedPermissions, 'content.entries.read')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const id = contentEntryMatch[1]!;
      const [entry] = await database.db
        .select()
        .from(contentEntries)
        .where(eq(contentEntries.id, id))
        .limit(1);
      if (!entry) {
        sendJson(response, 404, { error: 'Content entry not found' });
        return;
      }
      sendJson(response, 200, { entry });
      return;
    }

    if (url.pathname === '/content-entries' && method === 'GET') {
      if (!hasPermission(grantedPermissions, 'content.entries.read')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const siteId = url.searchParams.get('siteId');
      const status = url.searchParams.get('status');
      const rows = siteId
        ? await database.db.select().from(contentEntries).where(eq(contentEntries.siteId, siteId))
        : await database.db.select().from(contentEntries);
      sendJson(response, 200, {
        contentEntries: status ? rows.filter((row) => row.status === status) : rows,
      });
      return;
    }

    if (url.pathname === '/content-entries' && method === 'POST') {
      if (!hasPermission(grantedPermissions, 'content.entries.create')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const body = await readJson(request);
      const siteId = String(body.siteId ?? '');
      const contentTypeId = String(body.contentTypeId ?? '');
      const slug = String(body.slug ?? '');
      const title = body.title ? String(body.title) : null;
      const data = body.data && typeof body.data === 'object' ? body.data : {};
      const authorId = String(body.authorId ?? authenticated.user.id);
      if (!siteId || !contentTypeId || !slug) {
        sendJson(response, 400, { error: 'siteId, contentTypeId, and slug are required' });
        return;
      }
      const [entry] = await database.db
        .insert(contentEntries)
        .values({
          siteId,
          contentTypeId,
          authorId,
          slug,
          title,
          status: 'draft',
          currentRevisionId: null,
        })
        .returning();
      if (!entry) {
        sendJson(response, 500, { error: 'Failed to create content entry' });
        return;
      }
      const [revision] = await database.db
        .insert(contentRevisions)
        .values({
          siteId,
          contentEntryId: entry.id,
          revisionNumber: 1,
          data,
          createdByUserId: authorId,
        })
        .returning();
      if (revision) {
        await database.db
          .update(contentEntries)
          .set({ currentRevisionId: revision.id })
          .where(eq(contentEntries.id, entry.id));
      }
      sendJson(response, 201, { entry: { ...entry, currentRevisionId: revision?.id ?? null } });
      return;
    }

    const publishMatch = url.pathname.match(/^\/content-entries\/([^/]+)\/publish$/);
    if (publishMatch && method === 'POST') {
      if (!hasPermission(grantedPermissions, 'content.entries.publish')) {
        sendJson(response, 403, { error: 'Forbidden' });
        return;
      }
      const id = publishMatch[1]!;
      const body = await readJson(request);
      const revisionId = String(body.revisionId ?? '');
      if (!revisionId) {
        sendJson(response, 400, { error: 'revisionId is required' });
        return;
      }
      await database.db
        .update(contentEntries)
        .set({ status: 'published', publishedRevisionId: revisionId, publishedAt: new Date() })
        .where(eq(contentEntries.id, id));
      sendJson(response, 200, { status: 'published', entryId: id, revisionId });
      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as { code?: unknown }).code
        : undefined;
    if (error instanceof RequestBodyError) {
      sendJson(response, 400, { error: error.message });
      return;
    }
    if (code === '23505') {
      sendJson(response, 409, { error: 'Resource already exists' });
      return;
    }
    logger.error('Request failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    sendJson(response, 500, { error: 'Internal server error' });
  }
});

database.pool.on('error', (error) => {
  logger.error('Database pool error', {
    error: error instanceof Error ? error.message : String(error),
  });
});

if (config.port < 1 || config.port > 65535) {
  logger.error('Invalid port configuration', { port: config.port });
  process.exit(1);
}

const port = config.port;
server.listen(port, () => {
  logger.info('API listening', { port });
});

process.on('SIGTERM', () => {
  server.close(() => {
    database.close().finally(() => process.exit(0));
  });
});
