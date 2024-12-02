export function filterNested<T>(arr: T[][], fn: (item: T) => boolean): T[][] {
  return arr.map((row) => row.filter(fn));
}
