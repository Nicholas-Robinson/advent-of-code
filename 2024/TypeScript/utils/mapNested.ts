export function mapNested<T, U>(
  arr: T[][],
  fn: (item: T, index: number) => U,
): U[][] {
  return arr.map((row) => row.map(fn));
}
