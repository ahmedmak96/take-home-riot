# Development notes

Design decisions and details discussed while building this take-home API.

## Project layout

```
src/
  app.ts / server.ts / routes.ts
  modules/
    encryption/          # controller + service + tests
    signing/             # controller + service + tests
  utils/
    encryption/
      EncryptionAlgorithm.ts              # abstract base
      Base64Algorithm/                    # concrete implementation
    signing/
      SigningAlgorithm.ts                 # abstract base (sign/verify only)
      HmacAlgorithm/                      # concrete implementation (owns secret)
    canonicalJson/                        # order-independent JSON for HMAC
```

- Controllers wire a concrete algorithm into the service and handle HTTP.
- Services implement business rules and depend only on abstract algorithm types.
- Unit tests live next to the code they cover (`*.test.ts`).

## Encryption (`/encrypt`, `/decrypt`)

### Depth-1 only

Only **top-level** values are encrypted. Nested objects/arrays become **one** encrypted string under that key (inner fields are not encrypted individually).

### Type preservation

Each value is encoded as:

1. `JSON.stringify(value)` — keeps type info in the JSON text  
2. Base64-encode that string  

On decrypt: Base64 decode → `JSON.parse` → original type returns.

Examples:

| Original | JSON text before Base64 | After decrypt |
|----------|-------------------------|---------------|
| `"56023078"` (string) | `"56023078"` (with quotes) | string |
| `56023078` (number) | `56023078` (no quotes) | number |
| `{ email: "..." }` | `{"email":"..."}` | object |

There is **no separate type field**. Type is implied by JSON syntax inside the Base64 blob.

### Decrypt detection (encrypted vs plain)

For each depth-1 string:

1. Try Base64 decode  
2. Try `JSON.parse`  
3. Re-encrypt the result and check it **exactly equals** the input string  

If all succeed → treat as encrypted and restore the value.  
Otherwise → leave unchanged (e.g. `birth_date: "1998-11-19"`).

Non-strings pass through unchanged.

### Abstraction

```ts
abstract class EncryptionAlgorithm {
  abstract encrypt(value: unknown): string;
  abstract decrypt(encoded: string): unknown;
}

// wired once in encryption.service.ts
const algorithm: EncryptionAlgorithm = new Base64Algorithm();
export const encryptObject = ...
export const decryptObject = ...
```

The service depends on the abstract type and exports functions directly. Swapping algorithms means changing the instance assigned to `algorithm` in the service.

**Note:** Base64 is encoding for the challenge, not real encryption.

## Signing (`/sign`, `/verify`)

### Order-independent signatures

The README requires the signature to reflect the **value** of the payload, not property order in the JSON text.

`canonicalStringify`:

1. Recursively walk the value  
2. For each object, sort keys and recurse into values  
3. Arrays keep element order; recurse into elements  
4. `JSON.stringify` the normalized structure  

Then: `HMAC-SHA256(signatureSecret, canonicalString)`.

So `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` produce the same signature, including when nested keys differ in order.

Recursion is **one key-sort pass per object**, then recurse into children — not a single flat loop over the whole tree.

### Abstraction

```ts
abstract class SigningAlgorithm {
  abstract sign(canonicalString: string): string;
  abstract verify(canonicalString: string, signature: string): boolean;
}

// wired once in signing.service.ts
const signatureSecret = process.env.SIGNATURE_SECRET;
const algorithm: SigningAlgorithm = new HmacAlgorithm(signatureSecret);
export const sign = ...
export const verify = ...
```

The service is the composition root: it loads config, picks the concrete algorithm, and exports functions. Swapping algorithms means changing that one construction line.

### Why the secret is on `HmacAlgorithm`, not the abstract class

Real signing always needs confidential key material, but not every algorithm shares the same constructor shape:

- HMAC → one shared secret for sign and verify  
- Asymmetric (RSA/ECDSA) → private key to sign, public key to verify  

An abstract class should define the **behavior contract** (`sign` / `verify`), not force one shared construction model. `signing.service.ts` reads `SIGNATURE_SECRET` from the environment and passes it into `new HmacAlgorithm(signatureSecret)`. Algorithms stay free of `process.env` so they are easier to test and swap.

`TypeScript abstract` is compile-time. Plain JS has no `abstract` keyword; this project uses TS so `abstract class` / `abstract` methods are real language features.

### Verify responses

- Valid signature → HTTP **204** (no body)  
- Invalid / missing fields → HTTP **400**

Comparison uses `crypto.timingSafeEqual` to avoid timing leaks.

## Config

| Variable | Purpose |
|----------|---------|
| `SIGNATURE_SECRET` | Secret/key material for signing (used by the current HMAC implementation) |
| `PORT` | HTTP port (default `3000`) |

Use `.env` locally (gitignored). Commit `.env.example` as the template.

## Scripts

```bash
npm install
cp .env.example .env
npm start    # tsx runs TypeScript directly
npm test     # Jest + ts-jest
```

## Consistency guarantees

1. `/encrypt` then `/decrypt` → original payload (including types).  
2. `/sign` then `/verify` with the same data (any key order) → 204.  
3. Tampered data or wrong signature → 400.  
