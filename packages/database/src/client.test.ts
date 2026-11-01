import { describe, expect, it } from 'vitest';

import { createDatabaseClient } from './client.js';

describe('@typedpress/database', () => {
  it('creates a lazy database client without connecting', async () => {
    const client = createDatabaseClient({
      connectionString: 'postgresql://typedpress:typedpress@localhost:5432/typedpress',
      poolSize: 2,
    });

    expect(client.pool.options.max).toBe(2);
    await client.close();
  });
});
