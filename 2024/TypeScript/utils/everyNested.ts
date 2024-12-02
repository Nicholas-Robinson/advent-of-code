export function everyNested<T>(
  arr: T[][],
  fn: (item: T) => boolean,
): boolean[] {
  return arr.map((row) => row.every(fn));
}
