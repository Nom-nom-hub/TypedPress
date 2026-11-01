export * from './identity.js';
export * from './access.js';
export * from './audit.js';
export * from './content.js';
export * from './content-revisions.js';
export * from './taxonomy.js';
export * from './media.js';
export * from './relationships.js';

import * as identity from './identity.js';
import * as access from './access.js';
import * as audit from './audit.js';
import * as content from './content.js';
import * as contentRevisions from './content-revisions.js';
import * as taxonomy from './taxonomy.js';
import * as media from './media.js';
import * as relationships from './relationships.js';

export const platformSchema = {
  ...identity,
  ...access,
  ...audit,
  ...content,
  ...contentRevisions,
  ...taxonomy,
  ...media,
  ...relationships,
};
