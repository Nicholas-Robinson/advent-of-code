import { pipe } from "./_pipe.ts";

export const _Arr = {
  of: <T>(...items: T[]): T[] => items,
  from: <T>(arr: ArrayLike<T>): T[] => Array.from(arr),

  range: (start: number, end: number) =>
    Array.from({ length: end - start }, (_, i) => i + start),

  clone: <T>(arr: T[]): T[] => arr.slice(),
  append: <T>(item: T) => (arr: T[]): T[] => arr.slice().concat([item]),

  map: <T, R>(fn: (item: T, index: number) => R) => (arr: T[]): R[] =>
    arr.map(fn),

  mapN: ((...fns: any[]) => (arr: any[]) => {
    const result = [];
    for (const item of arr) {
      const res = [];
      for (let i = 0; i < fns.length; i++) {
        res.push(fns[i](item[i]));
      }
      result.push(res);
    }
    return result;
  }) as MapN,

  flatMap: <T, R>(fn: (item: T, index: number) => R[]) => (arr: T[]): R[] =>
    arr.flatMap(fn),

  filter: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): T[] =>
    arr.filter(fn),

  every: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): boolean =>
    arr.every(fn),

  some: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): boolean =>
    arr.some(fn),

  includes: <T>(item: T) => (arr: T[]): boolean => arr.includes(item),

  isEmpty: <T>(arr: T[]): boolean => arr.length === 0,

  reduce:
    <T, R>(fn: (acc: R, item: T, index: number) => R, initialValue: R) =>
    (arr: T[]): R => arr.reduce(fn, initialValue),

  sort: <T>(fn: (a: T, b: T) => number) => (arr: T[]): T[] => arr.toSorted(fn),
  reverse: <T>(arr: T[]): T[] => arr.reverse(),

  head: <T>(arr: T[]): T => arr[0],
  last: <T>(arr: T[]): T => arr[arr.length - 1],

  findIndex:
    <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): number =>
      arr.findIndex(fn),

  findLastIndex:
    <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): number => {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (fn(arr[i], i)) return i;
      }

      return -1;
    },

  unique: <T>(arr: T[]): T[] => {
    const seen = new Set<string>();
    return arr.filter((item) => {
      const key = `${item}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  uniqueBy: <T, K>(getKey: (value: T) => K) => (arr: T[]): T[] => {
    const seen = new Set<K>();
    return arr.filter((item) => {
      const key = getKey(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  mapNested:
    <T, R>(fn: (item: T, x: number, y: number) => R) => (arr: T[][]): R[][] =>
      arr.map((subArr, y) => subArr.map((value, x) => fn(value, x, y))),

  flatMapNested:
    <T, R>(fn: (item: T, x: number, y: number) => R[]) => (arr: T[][]): R[] =>
      arr.flatMap((subArr, y) => subArr.flatMap((value, x) => fn(value, x, y))),

  filterNested:
    <T>(fn: (item: T, index: number) => boolean) => (arr: T[][]): T[][] =>
      arr.map((subArr) => subArr.filter(fn)),

  findIndexNested:
    <T>(fn: (item: T, x: number, y: number) => boolean) =>
    (arr: T[][]): [number, number] => {
      for (let y = 0; y < arr.length; y++) {
        if (arr[y] === undefined) return [-1, -1];
        for (let x = 0; x < arr[y].length; x++) {
          if (fn(arr[y][x], x, y)) {
            return [x, y];
          }
        }
      }
      return [-1, -1];
    },

  findNested:
    <T>(fn: (item: T, x: number, y: number) => boolean) =>
    (arr: T[][]): T | undefined => {
      for (let y = 0; y < arr.length; y++) {
        if (arr[y] === undefined) return undefined;
        for (let x = 0; x < arr[y].length; x++) {
          if (fn(arr[y][x], x, y)) {
            return arr[y][x];
          }
        }
      }
      return undefined;
    },

  flatten: <T>(arr: T[][]): T[] => arr.flat(),

  drop: <T>(n: number) => (arr: T[]): T[] => arr.slice(n),
  dropEnd: <T>(n: number) => (arr: T[]): T[] => arr.slice(0, arr.length - n),
  dropNth: <T>(n: number) => (arr: T[]): T[] => arr.filter((_, i) => i !== n),
  dropWhile: <T>(fn: (item: T, index: number) => boolean) => (arr: T[]): T[] =>
    arr.slice(arr.findIndex((item, index) => !fn(item, index))),

  take: <T>(n: number) => (arr: T[]): T[] => arr.slice(0, n),

  prepend: <T>(item: T) => (arr: T[]): T[] => [item, ...arr],

  pairs: <T>(arr: T[]): [T, T][] => {
    const output: [T, T][] = [];

    for (let i = 0; i < arr.length; i += 2) {
      output.push([arr[i], arr[i + 1]]);
    }

    return output;
  },

  pairWithNext: <T>(arr: T[]): [T, T][] => {
    const output: [T, T][] = [];

    for (let i = 0; i < arr.length - 1; i++) {
      output.push([arr[i], arr[i + 1]]);
    }

    return output;
  },

  pairWithIndex: <T>(arr: T[]): [number, T][] => {
    const output: [number, T][] = [];

    for (let i = 0; i < arr.length; i++) {
      output.push([i, arr[i]]);
    }

    return output;
  },

  pairWithIndexNested: <T>(arr: T[][]): [number, number, T][][] =>
    pipe(
      arr,
      _Arr.mapNested((item, x, y) => [x, y, item] as [number, number, T]),
    ),

  groupBy:
    <T, K extends keyof any>(getKey: (item: T) => K) =>
    (arr: T[]): Record<K, T[]> => {
      const output = {} as Record<K, T[]>;

      for (const item of arr) {
        const key = getKey(item);

        if (!output[key]) {
          output[key] = [];
        }

        output[key].push(item);
      }

      return output;
    },

  generateNextUntil: <T>(
    gen: (prev: T, arr: T[]) => T,
    condition: (current: T, arr: T[]) => boolean,
  ) =>
  (arr: T[]) => {
    const res = arr.slice();

    while (!condition(res[res.length - 1], res)) {
      res.push(gen(res[res.length - 1], res));
    }

    return res;
  },

  length: <T>(arr: T[]): number => arr.length,

  combinationPairs: <T>(arr: T[]): [T, T][] => {
    const result = [] as [T, T][];

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        result.push([arr[i], arr[j]]);
      }
    }

    return result;
  },

  zip: <T, U>(arr1: T[], arr2: U[]): [T, U][] =>
    arr1.map((item, index) => [item, arr2[index]]),

  unzip: <T, U>(arr: [T, U][]): [T[], U[]] =>
    arr.reduce(
      ([acc1, acc2], [item1, item2]) => [[...acc1, item1], [...acc2, item2]],
      [[], []] as [T[], U[]],
    ),

  columns: <T>(arr: T[][]): T[][] => {
    const longest = arr.reduce((acc, subArr) => Math.max(acc, subArr.length), 0);
    const result = [] as T[][];
    for (let x = 0; x < longest; x++) {
      const column = [];
      for (let y = 0; y < arr.length; y++) {
        if (arr[y]?.[x]) column.push(arr[y][x]);
      }
      result.push(column);
    }
    return result;
  }
};

type MapN =
  & (<T1, U1>(fn: (item: T1) => U1) => (arr: T1[]) => U1[])
  & (<T1, T2, U1, U2>(
    fn1: (item: T1) => U1,
    fn2: (item: T2) => U2,
  ) => (arr: [T1, T2][]) => [U1, U2][])
  & (<T1, T2, T3, U1, U2, U3>(
    fn1: (item: T1) => U1,
    fn2: (item: T2) => U2,
    fn3: (item: T3) => U3,
  ) => (arr: [T1, T2, T3][]) => [U1, U2, U3][])
  & (<T1, T2, T3, T4, U1, U2, U3, U4>(
    fn1: (item: T1) => U1,
    fn2: (item: T2) => U2,
    fn3: (item: T3) => U3,
    fn4: (item: T4) => U4,
  ) => (arr: [T1, T2, T3, T4][]) => [U1, U2, U3, U4][])
  & (<T1, T2, T3, T4, T5, U1, U2, U3, U4, U5>(
    fn1: (item: T1) => U1,
    fn2: (item: T2) => U2,
    fn3: (item: T3) => U3,
    fn4: (item: T4) => U4,
    fn5: (item: T5) => U5,
  ) => (arr: [T1, T2, T3, T4, T5][]) => [U1, U2, U3, U4, U5][]);
