process.env.SIGNATURE_SECRET = 'test-secret';

import { sign, verify } from './signing.service';

describe('signing.service', () => {
  it('produces the same signature regardless of key order', () => {
    const a = sign({ message: 'Hello World', timestamp: 1616161616 });
    const b = sign({ timestamp: 1616161616, message: 'Hello World' });
    expect(a).toBe(b);
  });

  it('verifies a valid signature', () => {
    const payload = { message: 'Hello World', timestamp: 1616161616 };
    const signature = sign(payload);
    expect(verify(payload, signature)).toBe(true);
  });

  it('fails verification for tampered data', () => {
    const signature = sign({ message: 'Hello World', timestamp: 1616161616 });
    expect(verify({ message: 'Goodbye World', timestamp: 1616161616 }, signature)).toBe(
      false
    );
  });
});
