export const Fn = {
  tap: <T>(fn: (value: T) => void) => (value: T): T => {
    fn(value);
    return value;
  },

  debug: <T>(value: T) => {
    console.log(value);
    return value;
  },

  orDefault: <T>(defaultValue: T) => (value: T | null | undefined): T => {
    return value ?? defaultValue;
  },

  identity: <T>(value: T): T => value,
};
