import { EncryptionAlgorithm } from './EncryptionAlgorithm';
import { Base64Algorithm } from './Base64Algorithm/Base64Algorithm';

describe('EncryptionAlgorithm', () => {
  it('is implemented by Base64Algorithm with base type', () => {
    const algorithm: EncryptionAlgorithm = new Base64Algorithm();
    expect(algorithm).toBeInstanceOf(EncryptionAlgorithm);
    expect(algorithm).toBeInstanceOf(Base64Algorithm);
  });
});
