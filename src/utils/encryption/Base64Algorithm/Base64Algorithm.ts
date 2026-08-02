import { EncryptionAlgorithm } from '../EncryptionAlgorithm';

export class Base64Algorithm extends EncryptionAlgorithm {
  encrypt(value: unknown): string {
    const serialized = JSON.stringify(value);
    return Buffer.from(serialized, 'utf8').toString('base64');
  }

  decrypt(encoded: string): unknown {
    const serialized = Buffer.from(encoded, 'base64').toString('utf8');
    return JSON.parse(serialized);
  }
}
