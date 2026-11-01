import { describe, expect, it } from 'vitest';

import { createComponentRegistry } from './index.js';

describe('@typedpress/renderer', () => {
  it('registers and lists components', () => {
    const registry = createComponentRegistry();
    registry.register({
      metadata: {
        id: 'core:button',
        version: '1.0.0',
        displayName: 'Button',
        category: 'core',
      },
      component: () => null,
    });
    expect(registry.get('core:button')?.metadata.displayName).toBe('Button');
    expect(registry.list()).toHaveLength(1);
  });
});
