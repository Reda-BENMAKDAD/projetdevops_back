import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';

const PBKDF2_ITERATIONS = 120000;
const PBKDF2_LENGTH = 64;
const PBKDF2_DIGEST = 'sha512';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_LENGTH,
    PBKDF2_DIGEST,
  ).toString('hex');

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, storedHash] = passwordHash.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_LENGTH,
    PBKDF2_DIGEST,
  ).toString('hex');

  return timingSafeEqual(
    Buffer.from(storedHash, 'hex'),
    Buffer.from(candidateHash, 'hex'),
  );
}
