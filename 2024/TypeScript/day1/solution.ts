import { sumOf, unzip, zip } from "@std/collections";
import { identity } from "../utils/identity.ts";

type Parsed = [number[], number[]];

export function parse(raw: string): Parsed {
  const lines = raw.split("\n");

  const numbers = lines
    .map((line) => line.split(/\s+/))
    .map(([left, right]) => [Number(left), Number(right)] as [number, number]);

  return unzip(numbers);
}

export function part1([left, right]: Parsed) {
  const leftSort = left.sort((a, b) => a - b);
  const rightSort = right.sort((a, b) => a - b);

  const pairs = zip(leftSort, rightSort)
    .map(([a, b]) => Math.abs(a - b));

  return sumOf(pairs, identity);
}

export function part2([left, right]: Parsed) {
  const counts = right.reduce((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, [] as number[]);

  const pairs = left
    .map((value) => [value, counts[value] ?? 0] as const)
    .map(([value, count]) => value * count);

  return sumOf(pairs, identity);
}
