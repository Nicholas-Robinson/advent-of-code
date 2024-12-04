export const Bool = {
    passAll: <T>(...args: ((value: T) => boolean)[]) => (value: T) => args.every((fn) => fn(value)),
    passAny: <T>(...args: ((value: T) => boolean)[]) => (value: T) => args.some((fn) => fn(value)),
}