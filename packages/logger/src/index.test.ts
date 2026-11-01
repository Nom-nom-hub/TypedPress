import { describe, expect, it } from 'vitest';

import { createLogger, type LogEntry } from './index.js';

describe('@typedpress/logger', () => {
  it('records entries above the minimum level', () => {
    const entries: LogEntry[] = [];
    const logger = createLogger('warn', (entry) => entries.push(entry));

    logger.debug('hidden');
    logger.info('hidden');
    logger.warn('visible', { requestId: '123' });
    logger.error('also visible');

    expect(entries).toHaveLength(2);
    expect(entries[0]?.level).toBe('warn');
    expect(entries[0]?.context).toEqual({ requestId: '123' });
    expect(entries[1]?.level).toBe('error');
  });
});
