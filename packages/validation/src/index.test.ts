import { describe, expect, it } from 'vitest';

import { emailAddressSchema, requireAtLeastOneField, uuidSchema } from './index.js';
import { z } from './index.js';

describe('@typedpress/validation', () => {
  it('validates email addresses', () => {
    expect(emailAddressSchema.safeParse('user@example.com').success).toBe(true);
    expect(emailAddressSchema.safeParse('not-an-email').success).toBe(false);
  });

  it('validates uuids', () => {
    expect(uuidSchema.safeParse('123e4567-e89b-12d3-a456-426614174000').success).toBe(true);
    expect(uuidSchema.safeParse('invalid').success).toBe(false);
  });

  it('requires at least one provided field', () => {
    const schema = requireAtLeastOneField(z.object({ name: z.string().optional() }));
    expect(schema.safeParse({}).success).toBe(false);
    expect(schema.safeParse({ name: 'typedpress' }).success).toBe(true);
  });
});
