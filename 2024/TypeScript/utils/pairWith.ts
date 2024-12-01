export function pairWith<T, U>(value: T[], fn: (value: T) => U): [T, U][] {
  return value.map((v) => [v, fn(v)]);
}
