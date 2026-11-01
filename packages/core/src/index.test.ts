import { describe, expect, it } from 'vitest';

import { createPlatform, createServiceToken, type ServiceToken } from './index.js';

describe('@typedpress/core', () => {
  it('registers and resolves services', () => {
    const platform = createPlatform();
    const token = createServiceToken<number>('counter');
    platform.container.register(token, 42);
    expect(platform.container.has(token)).toBe(true);
    expect(platform.container.resolve(token)).toBe(42);
  });

  it('rejects duplicate service registrations', () => {
    const platform = createPlatform();
    const token = createServiceToken<string>('name');
    platform.container.register(token, 'typedpress');
    expect(() => platform.container.register(token, 'duplicate')).toThrow('already registered');
  });

  it('emits lifecycle events', async () => {
    const platform = createPlatform();
    const events: string[] = [];
    platform.events.on('platform.started', () => {
      events.push('started');
    });
    await platform.start();
    await platform.stop();
    expect(events).toEqual(['started']);
  });
});

// Keep this type reference exercised during typecheck.
const _token: ServiceToken<number> = createServiceToken<number>('typed');
