import { z } from 'zod';

import { isUuid } from '@typedpress/types';

export { z };

export const nonEmptyTrimmedString = z.string().trim().min(1);
export const emailAddressSchema = z.string().trim().email();
export const uuidSchema = z.string().refine(isUuid, 'Expected a valid UUID');

export function requireAtLeastOneField<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
) {
  return schema.refine(
    (value) => Object.values(value).some((entry) => entry !== undefined),
    'At least one field must be provided',
  );
}
