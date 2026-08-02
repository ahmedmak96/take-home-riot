import { Base64Algorithm } from './Base64Algorithm';

describe('Base64Algorithm', () => {
  const algorithm = new Base64Algorithm();

  it('round-trips primitives and objects', () => {
    expect(algorithm.decrypt(algorithm.encrypt('John Doe'))).toBe('John Doe');
    expect(algorithm.decrypt(algorithm.encrypt(30))).toBe(30);
    expect(algorithm.decrypt(algorithm.encrypt({ email: 'a@b.com' }))).toEqual({
      email: 'a@b.com',
    });
  });

  it('keeps numeric strings as strings', () => {
    expect(algorithm.decrypt(algorithm.encrypt('56023078'))).toBe('56023078');
  });
});
