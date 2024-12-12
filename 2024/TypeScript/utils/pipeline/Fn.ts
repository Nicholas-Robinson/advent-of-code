export const Fn = {
  tap: <T>(fn: (value: T) => void) => (value: T): T => {
    fn(value);
    return value;
  },

  debug: <T>(tag: string = "DEBUG ::") => (value: T) => {
    console.log(tag, value);
    return value;
  },

  orDefault: <T>(defaultValue: T) => (value: T | null | undefined): T => {
    return value ?? defaultValue;
  },

  identity: <T>(value: T): T => value,

  flip:
    <T, U, R>(fn: (arg1: T) => (arg2: U) => R) => (arg2: U) => (arg1: T): R =>
      fn(arg1)(arg2),

  apply: <T, R>(fn: (arg: T) => R) => (arg: T): R => fn(arg),
  bind: <T, R>(arg: T) => (fn: (arg: T) => R): R => fn(arg),
  just: <T>(value: T) => () => value,

  curry: <T, U, R>(fn: (arg1: T, arg2: U) => R) => (arg1: T) => (arg2: U): R =>
    fn(arg1, arg2),
  uncurry:
    <T, U, R>(fn: (arg1: T) => (arg2: U) => R) => (arg1: T, arg2: U): R =>
      fn(arg1)(arg2),
};
