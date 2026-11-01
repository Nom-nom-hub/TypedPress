import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from './password.js';

describe('@typedpress/auth password', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('super-secret-password');
    expect(hash).not.toBe('super-secret-password');
    expect(await verifyPassword('super-secret-password', hash)).toBe(true);
    expect(await verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('rejects malformed hashes', async () => {
    expect(await verifyPassword('password', 'not-a-hash')).toBe(false);
  });
});
