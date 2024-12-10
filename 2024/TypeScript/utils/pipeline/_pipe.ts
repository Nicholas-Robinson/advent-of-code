export function pipe<S, R1>(source: S, f1: (source: S) => R1): R1;
export function pipe<S, R1, R2>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
): R2;
export function pipe<S, R1, R2, R3>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
): R3;
export function pipe<S, R1, R2, R3, R4>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
): R4;
export function pipe<S, R1, R2, R3, R4, R5>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
): R5;
export function pipe<S, R1, R2, R3, R4, R5, R6>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
): R6;
export function pipe<S, R1, R2, R3, R4, R5, R6, R7>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
  f7: (source: R6) => R7,
): R7;
export function pipe<S, R1, R2, R3, R4, R5, R6, R7, R8>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
  f7: (source: R6) => R7,
  f8: (source: R7) => R8,
): R8;
export function pipe<S, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
  f7: (source: R6) => R7,
  f8: (source: R7) => R8,
  f9: (source: R8) => R9,
): R9;
export function pipe<S, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(
  source: S,
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
  f7: (source: R6) => R7,
  f8: (source: R7) => R8,
  f9: (source: R8) => R9,
  f10: (source: R9) => R10,
): R10;
export function pipe<T>(
  source: T,
  ...functions: ((source: any) => any)[]
): any {
  return functions.reduce((result, fn) => fn(result), source);
}
