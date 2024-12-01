export function zipWith<A, B, C>(f: (a: A, b: B) => C, as: A[], bs: B[]): C[] {
  return as.map((a, i) => f(a, bs[i]));
}
