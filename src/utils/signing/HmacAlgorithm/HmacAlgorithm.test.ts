import { HmacAlgorithm } from './HmacAlgorithm';

describe('HmacAlgorithm', () => {
  const algorithm = new HmacAlgorithm('test-secret');

  it('signs a canonical string', () => {
    const signature = algorithm.sign('{"a":1}');
    expect(typeof signature).toBe('string');
    expect(signature).toHaveLength(64);
  });

  it('verifies a matching signature', () => {
    const payload = '{"message":"Hello World"}';
    const signature = algorithm.sign(payload);
    expect(algorithm.verify(payload, signature)).toBe(true);
  });

  it('rejects a mismatched signature', () => {
    const signature = algorithm.sign('{"message":"Hello World"}');
    expect(algorithm.verify('{"message":"Goodbye World"}', signature)).toBe(false);
  });

  it('requires a signature secret', () => {
    expect(() => new HmacAlgorithm('')).toThrow('SIGNATURE_SECRET is required');
  });
});
