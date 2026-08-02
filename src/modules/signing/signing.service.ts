import { canonicalStringify } from '../../utils/canonicalJson/canonicalJson';
import { SigningAlgorithm } from '../../utils/signing/SigningAlgorithm';
import { HmacAlgorithm } from '../../utils/signing/HmacAlgorithm/HmacAlgorithm';

const signatureSecret = process.env.SIGNATURE_SECRET;
if (!signatureSecret) {
  throw new Error('SIGNATURE_SECRET is required');
}

const algorithm: SigningAlgorithm = new HmacAlgorithm(signatureSecret);

export const sign = (payload: unknown): string => {
  const canonical = canonicalStringify(payload);
  return algorithm.sign(canonical);
};

export const verify = (payload: unknown, signature: string): boolean => {
  const canonical = canonicalStringify(payload);
  return algorithm.verify(canonical, signature);
};
