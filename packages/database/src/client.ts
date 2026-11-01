import { Pool, type PoolConfig } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { PlatformConfig } from '@typedpress/config';

export type Database = NodePgDatabase<Record<string, never>>;

export interface DatabaseClient {
  readonly db: Database;
  readonly pool: Pool;
  close(): Promise<void>;
}

export interface CreateDatabaseClientOptions {
  readonly connectionString: string;
  readonly poolSize?: number;
}

export function createDatabaseClient(options: CreateDatabaseClientOptions): DatabaseClient {
  const poolConfig: PoolConfig = {
    connectionString: options.connectionString,
  };

  if (options.poolSize !== undefined) {
    poolConfig.max = options.poolSize;
  }

  const pool = new Pool(poolConfig);
  const db = drizzle(pool);

  return {
    db,
    pool,
    async close() {
      await pool.end();
    },
  };
}

export function createDatabaseClientFromConfig(config: PlatformConfig): DatabaseClient {
  return createDatabaseClient({
    connectionString: config.databaseUrl,
    poolSize: config.databasePoolSize,
  });
}
