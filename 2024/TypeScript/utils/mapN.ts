import { zip } from "@std/collections";

export function mapN<T1, R1>(tuple: [T1][], fn1: (arg1: T1) => R1): [R1][];
export function mapN<T1, T2, R1, R2>(
  tuple: [T1, T2][],
  fn1: (arg1: T1) => R1,
  fn2: (arg2: T2) => R2,
): [R1, R2][];
export function mapN<T1, T2, T3, R1, R2, R3>(
  tuple: [T1, T2, T3][],
  fn1: (arg1: T1) => R1,
  fn2: (arg2: T2) => R2,
  fn3: (arg3: T3) => R3,
): [R1, R2, R3][];
export function mapN<T extends unknown[], R>(
  tuples: T[],
  ...fn: ((args: T) => R)[]
) {
  return tuples
    .map((tuple) => zip(tuple, fn))
    .map((tuple) => tuple.map(([arg, f]) => f(arg as T)));
}
