export function sum(a: number, b: number) {
  return a + b;
}

export function multiply(a: number, b: number) {
  return a * b;
}

export function multiplyTuple([a, b]: [number, number]) {
  return multiply(a, b);
}

export function divide(a: number, b: number) {
  return a / b;
}

export function subtract(a: number, b: number) {
  return a - b;
}

export function subtractTuple([a, b]: [number, number]) {
  return subtract(a, b);
}

export function diff(a: number, b: number) {
  return Math.abs(a - b);
}

export function differenceTuple([a, b]: [number, number]) {
  return diff(a, b);
}
