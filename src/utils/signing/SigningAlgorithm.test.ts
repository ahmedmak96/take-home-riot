import { SigningAlgorithm } from './SigningAlgorithm';
import { HmacAlgorithm } from './HmacAlgorithm/HmacAlgorithm';

describe('SigningAlgorithm', () => {
  it('is implemented by HmacAlgorithm with base type', () => {
    const algorithm: SigningAlgorithm = new HmacAlgorithm('test-secret');
    expect(algorithm).toBeInstanceOf(SigningAlgorithm);
    expect(algorithm).toBeInstanceOf(HmacAlgorithm);
  });
});
