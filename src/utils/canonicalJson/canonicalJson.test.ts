import { canonicalize, canonicalStringify } from './canonicalJson';

describe('canonicalJson', () => {
  it('sorts object keys recursively', () => {
    expect(
      canonicalize({
        b: 1,
        a: { d: 2, c: 3 },
      })
    ).toEqual({
      a: { c: 3, d: 2 },
      b: 1,
    });
  });

  it('preserves array order', () => {
    expect(canonicalize({ items: [3, 1, 2] })).toEqual({ items: [3, 1, 2] });
  });

  it('produces the same string for different key orders', () => {
    const a = canonicalStringify({ message: 'Hello World', timestamp: 1616161616 });
    const b = canonicalStringify({ timestamp: 1616161616, message: 'Hello World' });
    expect(a).toBe(b);
  });
});
