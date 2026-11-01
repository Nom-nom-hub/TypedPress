export * from './identity.js';
export * from './access.js';
export * from './audit.js';
export * from './content.js';

import * as identity from './identity.js';
import * as access from './access.js';
import * as audit from './audit.js';
import * as content from './content.js';

export const platformSchema = {
  ...identity,
  ...access,
  ...audit,
  ...content,
};
