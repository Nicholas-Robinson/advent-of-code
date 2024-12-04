export function pipeline<S, R1>(f1: (source: S) => R1): (input: S) => R1;
export function pipeline<S, R1, R2>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
): (input: S) => R2;
export function pipeline<S, R1, R2, R3>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
): (input: S) => R3;
export function pipeline<S, R1, R2, R3, R4>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
): (input: S) => R4;
export function pipeline<S, R1, R2, R3, R4, R5>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
): (input: S) => R5;
export function pipeline<S, R1, R2, R3, R4, R5, R6>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
): (input: S) => R6;
export function pipeline<S, R1, R2, R3, R4, R5, R6, R7>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
  f7: (source: R6) => R7,
): (input: S) => R7;
export function pipeline<S, R1, R2, R3, R4, R5, R6, R7, R8>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
  f7: (source: R6) => R7,
  f8: (source: R7) => R8,
): (input: S) => R8;
export function pipeline<S, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  f1: (source: S) => R1,
  f2: (source: R1) => R2,
  f3: (source: R2) => R3,
  f4: (source: R3) => R4,
  f5: (source: R4) => R5,
  f6: (source: R5) => R6,
  f7: (source: R6) => R7,
  f8: (source: R7) => R8,
  f9: (source: R8) => R9,
): (input: S) => R9;
export function pipeline<S, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(
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
): (input: S) => R10;
export function pipeline<T>(
  ...functions: ((source: any) => any)[]
): (input: T) => any {
  return (input) => functions.reduce((result, fn) => fn(result), input);
}
