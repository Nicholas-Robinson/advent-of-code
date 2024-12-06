export const Tuple = {
  first: <T, U>(tuple: [T, U]): T => tuple[0],
  second: <T, U>(tuple: [T, U]): U => tuple[1],

  areEqual: <T, U>(tuple1: [T, U], tuple2: [T, U]): boolean =>
    tuple1[0] === tuple2[0] && tuple1[1] === tuple2[1],

  mapBoth: <T, U, V, W>(fn: (t: T) => V, gn: (u: U) => W) =>
  (
    tuple: [T, U],
  ): [V, W] => [fn(tuple[0]), gn(tuple[1])],

  toNamedRecord:
    <const F extends string, const S extends string, T, U>(f: F, s: S) =>
    (tuple: [T, U]) => ({
      [f]: tuple[0],
      [s]: tuple[1],
    } as { [K in F | S]: K extends F ? T : U }),
};
