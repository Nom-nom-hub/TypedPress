import { describe, expect, it } from 'vitest';

import { hasPermission, platformPermissions } from './index.js';

describe('@typedpress/permissions', () => {
  it('recognizes granted permissions', () => {
    expect(hasPermission(['platform.users.read'], 'platform.users.read')).toBe(true);
    expect(hasPermission(['platform.users.read'], 'platform.users.delete')).toBe(false);
  });

  it('supports wildcard permission', () => {
    expect(hasPermission(['*'], 'platform.sites.create')).toBe(true);
  });

  it('exposes the platform permission catalog', () => {
    expect(platformPermissions).toContain('platform.audit.read');
  });
});