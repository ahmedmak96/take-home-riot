import crypto from 'crypto';
import { SigningAlgorithm } from '../SigningAlgorithm';

export class HmacAlgorithm extends SigningAlgorithm {
  private readonly signatureSecret: string;

  constructor(signatureSecret: string) {
    super();
    if (!signatureSecret) {
      throw new Error('SIGNATURE_SECRET is required');
    }
    this.signatureSecret = signatureSecret;
  }

  sign(canonicalString: string): string {
    return crypto
      .createHmac('sha256', this.signatureSecret)
      .update(canonicalString, 'utf8')
      .digest('hex');
  }

  verify(canonicalString: string, signature: string): boolean {
    if (typeof signature !== 'string') {
      return false;
    }

    const expected = this.sign(canonicalString);
    const expectedBuf = Buffer.from(expected, 'utf8');
    const actualBuf = Buffer.from(signature, 'utf8');

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  }
}
