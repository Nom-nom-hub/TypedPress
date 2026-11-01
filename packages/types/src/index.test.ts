import { describe, expect, it } from 'vitest';

import { err, isUuid, ok } from './index.js';

describe('@typedpress/types', () => {
  it('creates successful results', () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(42);
    }
  });

  it('creates failed results', () => {
    const result = err(new Error('boom'));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error?.message).toBe('boom');
    }
  });

  it('validates UUID strings', () => {
    expect(isUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isUuid('not-a-uuid')).toBe(false);
  });
});
