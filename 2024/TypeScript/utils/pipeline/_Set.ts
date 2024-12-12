export const _Set = {
  from: <T>(iterable: Iterable<T>) => new Set(iterable),
  size: <T>(set: Set<T>) => set.size,

  has: <T>(set: Set<T>) => (value: T) => set.has(value),
};
