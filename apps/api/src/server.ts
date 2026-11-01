import http from 'node:http';

import { loadPlatformConfig } from '@typedpress/config';
import { createDatabaseClientFromConfig } from '@typedpress/database';
import { createLogger } from '@typedpress/logger';

const config = loadPlatformConfig();
const database = createDatabaseClientFromConfig(config);
const logger = createLogger();

const server = http.createServer((request, response) => {
  if (request.url === '/health' && request.method === 'GET') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'Not found' }));
});

const port = config.port;
server.listen(port, () => {
  logger.info('API listening', { port });
});

process.on('SIGTERM', async () => {
  await database.close();
  process.exit(0);
});