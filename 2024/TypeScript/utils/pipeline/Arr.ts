export const Arr = {
  of: <T>(...items: T[]): T[] => items,

  range: (start: number, end: number) =>
    Array.from({ length: end - start }, (_, i) => i + start),

  map: <T, R>(fn: (item: T, index: number) => R) => (arr: T[]): R[] =>
    arr.map(fn),

  flatMap: <T, R>(fn: (item: T, index: number) => R[]) => (arr: T[]): R[] =>
    arr.flatMap(fn),

  filter: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): T[] =>
    arr.filter(fn),

  every: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): boolean =>
    arr.every(fn),

  some: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): boolean =>
    arr.some(fn),

  reduce:
    <T, R>(fn: (acc: R, item: T, index: number) => R, initialValue: R) =>
    (arr: T[]): R => arr.reduce(fn, initialValue),

  mapNested: <T, R>(fn: (item: T, x: number, y: number) => R) => (arr: T[][]): R[][] =>
    arr.map((subArr, y) => subArr.map((value, x) => fn(value, x, y))),

  flatMapNested: <T, R>(fn: (item: T, x: number, y: number) => R[]) => (arr: T[][]): R[] =>
    arr.flatMap((subArr, y) => subArr.flatMap((value, x) => fn(value, x, y))),

  filterNested:
    <T>(fn: (item: T, index: number) => boolean) => (arr: T[][]): T[][] =>
      arr.map((subArr) => subArr.filter(fn)),

  drop: <T>(n: number) => (arr: T[]): T[] => arr.slice(n),
  dropEnd: <T>(n: number) => (arr: T[]): T[] => arr.slice(0, arr.length - n),
  dropNth: <T>(n: number) => (arr: T[]): T[] => arr.filter((_, i) => i !== n),

  prepend: <T>(item: T) => (arr: T[]): T[] => [item, ...arr],

  pairWithNext: <T>(arr: T[]): [T, T][] => {
    const output: [T, T][] = [];

    for (let i = 0; i < arr.length - 1; i++) {
      output.push([arr[i], arr[i + 1]]);
    }

    return output;
  },

  length: <T>(arr: T[]): number => arr.length,
};
