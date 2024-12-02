export const Arr = {
  map: <T, R>(fn: (item: T, index: number) => R) => (arr: T[]): R[] =>
    arr.map(fn),

  filter: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): T[] =>
    arr.filter(fn),

  mapNested: <T, R>(fn: (item: T, index: number) => R) => (arr: T[][]): R[][] =>
    arr.map((subArr) => subArr.map(fn)),

  filterNested:
    <T>(fn: (item: T, index: number) => boolean) => (arr: T[][]): T[][] =>
      arr.map((subArr) => subArr.filter(fn)),
};
