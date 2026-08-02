import { EncryptionAlgorithm } from '../../utils/encryption/EncryptionAlgorithm';
import { Base64Algorithm } from '../../utils/encryption/Base64Algorithm/Base64Algorithm';

export type JsonObject = Record<string, unknown>;

const algorithm: EncryptionAlgorithm = new Base64Algorithm();

export const encryptObject = (payload: JsonObject): Record<string, string> => {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Payload must be a JSON object');
  }

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload)) {
    result[key] = algorithm.encrypt(value);
  }
  return result;
};

const tryDecrypt = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    const decrypted = algorithm.decrypt(value);
    if (algorithm.encrypt(decrypted) === value) {
      return decrypted;
    }
  } catch {
    // Not a valid encrypted value
  }

  return value;
};

export const decryptObject = (payload: JsonObject): JsonObject => {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Payload must be a JSON object');
  }

  const result: JsonObject = {};
  for (const [key, value] of Object.entries(payload)) {
    result[key] = tryDecrypt(value);
  }
  return result;
};
