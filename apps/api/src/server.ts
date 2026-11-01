import http from 'node:http';

import { loadPlatformConfig } from '@typedpress/config';
import { createDatabaseClientFromConfig, sites, users, workspaces } from '@typedpress/database';
import { hashPassword, verifyPassword, createSession, resolveSession } from '@typedpress/auth';
import { createLogger } from '@typedpress/logger';
import { eq } from 'drizzle-orm';

const config = loadPlatformConfig();
const database = createDatabaseClientFromConfig(config);
const logger = createLogger();

async function readJson(request: http.IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return {};
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
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
      const email = String(body.email ?? '');
      const password = String(body.password ?? '');
      const displayName = String(body.displayName ?? email);
      if (!email || !password) {
        sendJson(response, 400, { error: 'email and password are required' });
        return;
      }
      const passwordHash = await hashPassword(password);
      const [user] = await database.db
        .insert(users)
        .values({ email, passwordHash, displayName })
        .returning();
      if (!user) {
        sendJson(response, 500, { error: 'Failed to create user' });
        return;
      }
      const session = await createSession(database.db, user.id);
      sendJson(response, 201, { user, token: session.token });
      return;
    }

    if (url.pathname === '/auth/login' && method === 'POST') {
      const body = await readJson(request);
      const email = String(body.email ?? '');
      const password = String(body.password ?? '');
      const [user] = await database.db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
        sendJson(response, 401, { error: 'Invalid credentials' });
        return;
      }
      const session = await createSession(database.db, user.id);
      sendJson(response, 200, { user, token: session.token });
      return;
    }

    const authenticated = await requireSession(request);
    if (!authenticated) {
      sendJson(response, 401, { error: 'Authentication required' });
      return;
    }

    if (url.pathname === '/users' && method === 'GET') {
      const rows = await database.db.select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        status: users.status,
      }).from(users);
      sendJson(response, 200, { users: rows });
      return;
    }

    if (url.pathname === '/users' && method === 'POST') {
      const body = await readJson(request);
      const email = String(body.email ?? '');
      const password = String(body.password ?? '');
      const displayName = String(body.displayName ?? email);
      if (!email || !password) {
        sendJson(response, 400, { error: 'email and password are required' });
        return;
      }
      const passwordHash = await hashPassword(password);
      const [user] = await database.db.insert(users).values({ email, passwordHash, displayName }).returning();
      if (!user) {
        sendJson(response, 500, { error: 'Failed to create user' });
        return;
      }
      sendJson(response, 201, { user });
      return;
    }
    if (url.pathname === '/workspaces' && method === 'GET') {
      const rows = await database.db.select().from(workspaces);
      sendJson(response, 200, { workspaces: rows });
      return;
    }

    if (url.pathname === '/workspaces' && method === 'POST') {
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
      const rows = await database.db.select().from(sites);
      sendJson(response, 200, { sites: rows });
      return;
    }

    if (url.pathname === '/sites' && method === 'POST') {
      const body = await readJson(request);
      const workspaceId = String(body.workspaceId ?? '');
      const name = String(body.name ?? '');
      const slug = String(body.slug ?? '');
      if (!workspaceId || !name || !slug) {
        sendJson(response, 400, { error: 'workspaceId, name, and slug are required' });
        return;
      }
      const [site] = await database.db.insert(sites).values({ workspaceId, name, slug }).returning();
      sendJson(response, 201, { site });
      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    logger.error('Request failed', { error: error instanceof Error ? error.message : String(error) });
    sendJson(response, 500, { error: 'Internal server error' });
  }
});

const port = config.port;
server.listen(port, () => {
  logger.info('API listening', { port });
});

process.on('SIGTERM', async () => {
  await database.close();
  process.exit(0);
});