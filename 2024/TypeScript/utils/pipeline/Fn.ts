export const Fn = {
  tap: <T>(fn: (value: T) => void) => (value: T): T => {
    fn(value);
    return value;
  },

  debug: <T>(value: T) => {
    console.log(value);
    return value;
  },
};
