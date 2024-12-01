export function countBy<T, K extends string | number>(
  arr: T[],
  predicate: (item: T) => K,
): Record<K, number> {
  return arr.reduce((acc, item) => {
    const key = predicate(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<K, number>);
}
