import { describe, expect, it } from 'vitest';

import { loadPlatformConfig } from './index.js';

describe('@typedpress/config', () => {
  it('loads a valid configuration', () => {
    const config = loadPlatformConfig({
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://localhost/test',
      SESSION_SECRET: 'a'.repeat(32),
      CSRF_SECRET: 'b'.repeat(32),
    });

    expect(config.databaseUrl).toBe('postgresql://localhost/test');
    expect(config.port).toBe(3000);
    expect(config.storageDriver).toBe('local');
  });

  it('throws for invalid configuration', () => {
    expect(() =>
      loadPlatformConfig({
        DATABASE_URL: 'postgresql://localhost/test',
        SESSION_SECRET: 'short',
        CSRF_SECRET: 'b'.repeat(32),
      }),
    ).toThrow();
  });
});
