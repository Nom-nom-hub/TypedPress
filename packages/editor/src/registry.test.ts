import { describe, expect, it } from 'vitest';

import { createEditorComponentRegistry } from './registry.js';

describe('@typedpress/editor registry', () => {
  it('registers and exposes definitions', () => {
    const registry = createEditorComponentRegistry();
    registry.register({
      id: 'core:container',
      version: '1.0.0',
      displayName: 'Container',
      category: 'layout',
      allowedChildren: ['*'],
    });
    expect(registry.get('core:container')?.displayName).toBe('Container');
    expect(registry.isChildAllowed('core:container', 'core:hero')).toBe(true);
  });

  it('rejects duplicate definitions', () => {
    const registry = createEditorComponentRegistry();
    registry.register({
      id: 'core:hero',
      version: '1.0.0',
      displayName: 'Hero',
      category: 'sections',
    });
    expect(() =>
      registry.register({
        id: 'core:hero',
        version: '1.0.0',
        displayName: 'Hero',
        category: 'sections',
      }),
    ).toThrow();
  });
});
