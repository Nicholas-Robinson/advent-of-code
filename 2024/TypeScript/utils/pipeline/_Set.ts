export const _Set = {
  from: <T>(iterable: Iterable<T>) => new Set(iterable),
  size: <T>(set: Set<T>) => set.size,
};
