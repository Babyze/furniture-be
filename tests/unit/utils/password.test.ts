import { beforeEach, describe, expect, it } from '@jest/globals';
import { comparePassword, hashPassword } from '@src/utils/password.util';

describe('Password Utils', () => {
  const testPassword = 'testPassword123';
  let hashedPassword: string;

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      hashedPassword = await hashPassword(testPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(testPassword);
    });

    it('should generate different hashes for the same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    beforeEach(async () => {
      hashedPassword = await hashPassword(testPassword);
    });

    it('should return true when comparing correct password', async () => {
      const result = await comparePassword(testPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false when comparing incorrect password', async () => {
      const wrongPassword = 'wrongPassword123';
      const result = await comparePassword(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should return false when comparing with empty password', async () => {
      const result = await comparePassword('', hashedPassword);
      expect(result).toBe(false);
    });
  });
});
