export const Bool = {
  passAll: <T>(...args: ((value: T) => boolean)[]) => (value: T) =>
    args.every((fn) => fn(value)),

  passAny: <T>(...args: ((value: T) => boolean)[]) => (value: T) =>
    args.some((fn) => fn(value)),

  lt: <T>(a: T) => (b: T): boolean => a > b,
  lte: <T>(a: T) => (b: T): boolean => a >= b,
  gt: <T>(a: T) => (b: T): boolean => a < b,
  gte: <T>(a: T) => (b: T): boolean => a <= b,
  eq: <T>(a: T) => (b: T): boolean => a === b,
  neq: <T>(a: T) => (b: T): boolean => a !== b,

  invert: <T>(fn: (value: T) => boolean) => (value: T) => !fn(value),
};
