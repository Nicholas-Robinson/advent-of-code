export const Bool = {
  passAll:
    <T extends any[]>(args: ((...params: T) => boolean)[]) => (...params: T) =>
      args.every((fn) => fn(...params)),

  passAny:
    <T extends any[]>(args: ((...params: T) => boolean)[]) => (...params: T) =>
      args.some((fn) => fn(...params)),

  lt: <T>(a: T) => (b: T): boolean => a > b,
  lte: <T>(a: T) => (b: T): boolean => a >= b,
  gt: <T>(a: T) => (b: T): boolean => a < b,
  gte: <T>(a: T) => (b: T): boolean => a <= b,
  eq: <T>(a: T) => (b: T): boolean => a === b,
  neq: <T>(a: T) => (b: T): boolean => a !== b,

  defined: <T>(value: T) => value !== undefined,

  invert: <T>(fn: (value: T) => boolean) => (value: T) => !fn(value),

  branch: <T, U, W>(
    fn: (value: T) => boolean,
    onTrue: (value: T) => U,
    onFalse: (value: T) => W,
  ) =>
  (value: T) => fn(value) ? onTrue(value) : onFalse(value),
};
