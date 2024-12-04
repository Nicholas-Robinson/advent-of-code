import { differenceTuple } from "../utils/calc.ts"
import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { seededPipeline } from "../utils/pipeline/_seededPipeline.ts"
import { Arr } from "../utils/pipeline/Arr.ts"
import { Bool } from "../utils/pipeline/Bool.ts"
import { Fn } from "../utils/pipeline/Fn.ts"
import { Str } from "../utils/pipeline/Str.ts"

type Parsed = number[][];

export const parse = pipeline(
  Str.lines,
  Arr.map(Str.words),
  Arr.mapNested(Number),
);

const isAllIncreasingOrDecreasing = Bool.passAny(
  checkMagnitude(Fn.uncurry(Bool.gt)),
  checkMagnitude(Fn.uncurry(Bool.lt)),
);

export const part1 = pipeline(
  // Filter out the lines that are all increasing or decreasing
  Arr.filter(isAllIncreasingOrDecreasing),
  // Filter out the differences that are greater than 2
  Arr.map(Arr.pairWithNext),
  Arr.mapNested(differenceTuple),
  Arr.filterNested((i) => i === 0 || i > 3),
  // The empty lists are the ones that are safe
  Arr.filter((i) => i.length === 0),
  Arr.length,
);

const createSubArrayOf = Fn.flip(Arr.dropNth<number>);

export function part2(input: Parsed) {
  const faultTolerantSafeLines = input.filter((line) => {
    return seededPipeline(
      Arr.range(0, line.length),
      Arr.map(createSubArrayOf(line)),
      Arr.prepend(line),
      Arr.map((row) => [row]),
      Arr.some(
        pipeline(part1, Bool.gt(0)),
      ),
    );
  });

  return faultTolerantSafeLines.length;
}

function checkMagnitude(compare: (a: number, b: number) => boolean) {
  return (list: number[]) =>
    list.every((value, index) =>
      index === 0 || compare(value, list[index - 1])
    );
}
