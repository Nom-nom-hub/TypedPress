import { describe, expect, it } from 'vitest';

import { createThemeRegistry, themeManifestSchema } from './index.js';

describe('@typedpress/themes', () => {
  it('registers a valid theme manifest', () => {
    const registry = createThemeRegistry();
    registry.register({
      id: 'starter',
      name: 'Starter',
      version: '1.0.0',
      templates: ['default'],
      designTokens: {},
    });
    expect(registry.get('starter')?.name).toBe('Starter');
    expect(themeManifestSchema.parse({ id: 'x', name: 'X', version: '1.0.0' }).templates).toEqual(
      [],
    );
  });
});
