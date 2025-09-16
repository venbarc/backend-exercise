export type Value = string | number | boolean | null | undefined |
  Date | Buffer | Map<unknown, unknown> | Set<unknown> |
  Array<Value> | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  // Handle null and undefined directly.
  if (value === null || value === undefined) return value;

  // Strings, numbers, and booleans can be returned as-is.
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  // Dates are stored as a tagged object with their timestamp.
  if (value instanceof Date) {
    return { __t: 'Date', __v: value.getTime() };
  }

  // Buffers are stored as an array of bytes.
  if (Buffer.isBuffer(value)) {
    return { __t: 'Buffer', __v: Array.from(value) };
  }

  // Sets are stored as arrays with a Set tag.
  if (value instanceof Set) {
    return { __t: 'Set', __v: Array.from(value).map(v => serialize(v as Value)) };
  }

  // Maps are stored as an array of [key, value] pairs.
  if (value instanceof Map) {
    return {
      __t: 'Map',
      __v: Array.from(value.entries()).map(([k, v]) => [k, serialize(v as Value)]),
    };
  }

  // Arrays need to be serialized element by element.
  if (Array.isArray(value)) {
    return value.map(v => serialize(v));
  }

  // Plain objects are serialized by recursively handling each property.
  if (typeof value === 'object') {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      obj[k] = serialize(v as Value);
    }
    return obj;
  }

  // Fallback case
  return value;

}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  
  // Scalars (null, undefined, string, number, boolean) can be returned directly.
  if (value === null || value === undefined) return value as T;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value as T;
  }

  if (typeof value === 'object') {
    const obj = value as any;

    // Special tagged types
    if (obj.__t === 'Date') {
      return new Date(obj.__v) as T;
    }

    if (obj.__t === 'Buffer') {
      return Buffer.from(obj.__v) as T;
    }

    if (obj.__t === 'Set') {
      return new Set(obj.__v.map((v: unknown) => deserialize(v))) as T;
    }

    if (obj.__t === 'Map') {
      return new Map(obj.__v.map(([k, v]: [unknown, unknown]) => [k, deserialize(v)])) as T;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(v => deserialize(v)) as T;
    }

    // Handle plain objects
    const result: Record<string, Value> = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = deserialize(v);
    }
    return result as T;
  }

  // Fallback for any unexpected cases.
  return value as T;
  
  return;
}
