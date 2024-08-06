import * as crypto from 'crypto';

// Encrypt Password
export function getSaltedPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}
