export const Arr = {
  map: <T, R>(fn: (item: T, index: number) => R) => (arr: T[]): R[] =>
    arr.map(fn),

  filter: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): T[] =>
    arr.filter(fn),

  reduce: <T, R>(fn: (acc: R, item: T, index: number) => R, initialValue: R) => (arr: T[]): R =>
    arr.reduce(fn, initialValue),

  mapNested: <T, R>(fn: (item: T, index: number) => R) => (arr: T[][]): R[][] =>
    arr.map((subArr) => subArr.map(fn)),

  filterNested:
    <T>(fn: (item: T, index: number) => boolean) => (arr: T[][]): T[][] =>
      arr.map((subArr) => subArr.filter(fn)),

    drop: <T>(n: number) => (arr: T[]): T[] => arr.slice(n),
    dropEnd: <T>(n: number) => (arr: T[]): T[] => arr.slice(0, arr.length - n),
};
