import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const algorithm = 'aes-256-gcm';
const encryptedBirthDateParts = 3;

export function encryptBirthDate(value: string): string {
  const key = getProfileEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [iv, authTag, ciphertext]
    .map((part) => part.toString('base64url'))
    .join(':');
}

export function decryptBirthDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const parts = value.split(':');

    if (parts.length !== encryptedBirthDateParts) {
      return null;
    }

    const [ivPart, authTagPart, ciphertextPart] = parts;
    const key = getProfileEncryptionKey();
    const decipher = createDecipheriv(
      algorithm,
      key,
      Buffer.from(ivPart, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(authTagPart, 'base64url'));

    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextPart, 'base64url')),
      decipher.final(),
    ]);

    return plaintext.toString('utf8');
  } catch {
    return null;
  }
}

export function normalizeBirthDate(value: string): string {
  const normalized = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new BadRequestException('birthDate must use YYYY-MM-DD format');
  }

  const birthDate = new Date(`${normalized}T00:00:00.000Z`);

  if (Number.isNaN(birthDate.getTime())) {
    throw new BadRequestException('birthDate must be a valid date');
  }

  const [year, month, day] = normalized.split('-').map(Number);

  if (
    birthDate.getUTCFullYear() !== year ||
    birthDate.getUTCMonth() + 1 !== month ||
    birthDate.getUTCDate() !== day
  ) {
    throw new BadRequestException('birthDate must be a valid date');
  }

  const age = calculateAge(normalized);

  if (age === null || age < 16 || age > 100) {
    throw new BadRequestException('birthDate must result in an age between 16 and 100');
  }

  return normalized;
}

export function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) {
    return null;
  }

  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age -= 1;
  }

  return age;
}

function getProfileEncryptionKey(): Buffer {
  const rawKey = process.env.PROFILE_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new InternalServerErrorException('PROFILE_ENCRYPTION_KEY is not configured');
  }

  return createHash('sha256').update(rawKey).digest();
}
