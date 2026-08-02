export abstract class EncryptionAlgorithm {
  abstract encrypt(value: unknown): string;
  abstract decrypt(encoded: string): unknown;
}
