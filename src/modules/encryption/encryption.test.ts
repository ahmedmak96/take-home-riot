import { decryptObject, encryptObject } from './encryption.service';

describe('encryption.service', () => {
  const samplePayload = {
    name: 'John Doe',
    age: 30,
    contact: {
      email: 'john@example.com',
      phone: '123-456-7890',
    },
  };

  it('encrypts only depth-1 values as strings', () => {
    const encrypted = encryptObject(samplePayload);

    expect(Object.keys(encrypted)).toEqual(['name', 'age', 'contact']);
    expect(typeof encrypted.name).toBe('string');
    expect(typeof encrypted.age).toBe('string');
    expect(typeof encrypted.contact).toBe('string');
  });

  it('decrypts back to the original payload', () => {
    const encrypted = encryptObject(samplePayload);
    expect(decryptObject(encrypted)).toEqual(samplePayload);
  });

  it('leaves unencrypted values unchanged', () => {
    const encrypted = encryptObject(samplePayload);
    const mixed = { ...encrypted, birth_date: '1998-11-19' };

    expect(decryptObject(mixed)).toEqual({
      ...samplePayload,
      birth_date: '1998-11-19',
    });
  });

  it('rejects non-object payloads', () => {
    expect(() => encryptObject(null as unknown as Record<string, unknown>)).toThrow(
      'Payload must be a JSON object'
    );
    expect(() => encryptObject([1, 2] as unknown as Record<string, unknown>)).toThrow(
      'Payload must be a JSON object'
    );
  });
});
