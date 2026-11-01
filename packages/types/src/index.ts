/**
 * Shared platform type contracts.
 *
 * This package contains framework-independent primitive types. It must not
 * depend on any runtime framework such as Next.js, React, or Drizzle.
 */

export type Brand<TValue, TBrand extends string> = TValue & {
  readonly __brand: TBrand;
};

export type Uuid = Brand<string, 'Uuid'>;

export type SiteId = Brand<Uuid, 'SiteId'>;
export type UserId = Brand<Uuid, 'UserId'>;
export type WorkspaceId = Brand<Uuid, 'WorkspaceId'>;

export interface Result<TValue, TError extends Error = Error> {
  readonly ok: boolean;
  readonly value?: TValue;
  readonly error?: TError;
}

export function ok<TValue>(value: TValue): Result<TValue, never> {
  return { ok: true, value };
}

export function err<TError extends Error = Error>(error: TError): Result<never, TError> {
  return { ok: false, error };
}

export function isUuid(value: string): value is Uuid {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
