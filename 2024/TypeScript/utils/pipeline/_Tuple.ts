export const _Tuple = {
  lift: <T, U>([first, second]: (T | U)[]): [T, U] => [first, second] as [T, U],
  from: <T, U>(first: T, second: U): [T, U] => [first, second],

  first: <T, U>(tuple: [T, U]): T => tuple[0],
  second: <T, U>(tuple: [T, U]): U => tuple[1],

  areEqual: <T, U>(tuple1: [T, U], tuple2: [T, U]): boolean =>
    tuple1[0] === tuple2[0] && tuple1[1] === tuple2[1],

  mapBoth: <T, U, V, W>(fn: (t: T) => V, gn: (u: U) => W) =>
  (
    tuple: [T, U],
  ): [V, W] => [fn(tuple[0]), gn(tuple[1])],

  mapFirst: <T, U, V>(fn: (t: T) => V) => (tuple: [T, U]): [V, U] => [
    fn(tuple[0]),
    tuple[1],
  ],
  mapSecond: <T, U, V>(fn: (u: U) => V) => (tuple: [T, U]): [T, V] => [
    tuple[0],
    fn(tuple[1]),
  ],

  toNamedRecord:
    <const F extends string, const S extends string, T, U>(f: F, s: S) =>
    (tuple: [T, U]) => ({
      [f]: tuple[0],
      [s]: tuple[1],
    } as { [K in F | S]: K extends F ? T : U }),

  pairWith: <T, U>(getPair: (first: T) => U) => (value: T): [T, U] => [
    value,
    getPair(value),
  ],

  swap: <T, U>(tuple: [T, U]): [U, T] => [tuple[1], tuple[0]],
};

export type Tuple<T, U = T> = [T, U];
