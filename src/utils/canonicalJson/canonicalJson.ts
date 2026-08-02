/**
 * Recursively sorts object keys so HMAC input is independent of property order.
 */
export function canonicalize(value: unknown): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  const record = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    sorted[key] = canonicalize(record[key]);
  }
  return sorted;
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}
