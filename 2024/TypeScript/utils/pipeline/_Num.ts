export const _Num = {
  sumAll: (arr: number[]): number => arr.reduce((acc, curr) => acc + curr, 0),
  subtractAll: (arr: number[]): number =>
    arr.reduce((acc, curr) => acc - curr, 0),
  multiplyAll: (arr: number[]): number =>
    arr.reduce((acc, curr) => acc * curr, 1),
  divideAll: (arr: number[]): number =>
    arr.reduce((acc, curr) => acc / curr, 1),
  absAll: (arr: number[]): number[] => arr.map((num) => Math.abs(num)),

  add: (b: number) => (a: number): number => a + b,
  subtract: (b: number) => (a: number): number => a - b,
  divide: (b: number) => (a: number): number => a / b,
  multiply: (b: number) => (a: number): number => a * b,

  max: (arr: number[]): number => Math.max(...arr),
  min: (arr: number[]): number => Math.min(...arr),
};