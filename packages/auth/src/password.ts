import { randomBytes, scrypt, timingSafeEqual, type BinaryLike } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
) => Promise<Buffer>;

export interface PasswordHash {
  readonly algorithm: 'scrypt';
  readonly salt: string;
  readonly hash: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, salt, expectedHash] = parts;
  if (!salt || !expectedHash) {
    return false;
  }

  try {
    const saltBuffer = Buffer.from(salt, 'base64url');
    const expectedBuffer = Buffer.from(expectedHash, 'base64url');
    const actualBuffer = await scryptAsync(password, saltBuffer, expectedBuffer.length);

    if (actualBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return timingSafeEqual(actualBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
