import { differenceTuple } from "../utils/calc.ts"
import { mapNested } from "../utils/mapNested.ts"
import { Arr } from "../utils/pipeline/Arr.ts"
import { pipeline } from "../utils/pipeline/pipeline.ts"
import { spaceSeparatedLines } from "../utils/spaceSeparatedLines.ts"

type Parsed = number[][];

export function parse(raw: string): Parsed {
  const lines = spaceSeparatedLines(raw);
  return mapNested(lines, Number);
}

export function part1(input: Parsed) {
  const safeLines = pipeline(
    input,
    // Filter out the lines that are all increasing or decreasing
    Arr.filter(isAllIncreasingOrDecreasing),
    // Filter out the differences that are greater than 2
    Arr.map(pairWithNeighbors),
    Arr.mapNested(differenceTuple),
    Arr.filterNested((i) => i === 0 || i > 3),
    // The empty lists are the ones that are safe
    Arr.filter((i) => i.length === 0),
  );

  return safeLines.length;
}

export function part2(input: Parsed) {
  const faultTolerantSafeLines = input.filter((line) => {
    if (part1([line]) > 0) {
      return true;
    }

    for (let i = 0; i < line.length; i++) {
      const removed = dropNth(line, i);
      if (part1([removed]) > 0) {
        return true;
      }
    }

    return false;
  });

  return faultTolerantSafeLines.length;
}

function pairWithNeighbors(arr: number[]) {
  const output: [number, number][] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    output.push([arr[i], arr[i + 1]]);
  }

  return output;
}

function isAllIncreasingOrDecreasing(list: number[]) {
  const allIncreasing = list.every((value, index) =>
    index === 0 || value > list[index - 1]
  );

  const allDecreasing = list.every((value, index) =>
    index === 0 || value < list[index - 1]
  );

  return allIncreasing || allDecreasing;
}

function dropNth<T>(arr: T[], n: number) {
  return arr.filter((_, i) => i !== n);
}
