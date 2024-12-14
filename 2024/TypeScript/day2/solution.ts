import { differenceTuple } from "../utils/calc.ts";
import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Bool } from "../utils/pipeline/_Bool.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Str } from "../utils/pipeline/_Str.ts";

type Parsed = number[][];

export const parse = pipeline(
  _Str.lines,
  _Arr.map(_Str.words),
  _Arr.mapNested(Number),
);

const isAllIncreasingOrDecreasing = _Bool.passAny([
  checkMagnitude(_Fn.uncurry(_Bool.gt)),
  checkMagnitude(_Fn.uncurry(_Bool.lt)),
]);

export const part1 = pipeline(
  // Filter out the lines that are all increasing or decreasing
  _Arr.filter(isAllIncreasingOrDecreasing),
  // Filter out the differences that are greater than 2
  _Arr.map(_Arr.pairWithNext),
  _Arr.mapNested(differenceTuple),
  _Arr.filterNested((i) => i === 0 || i > 3),
  // The empty lists are the ones that are safe
  _Arr.filter((i) => i.length === 0),
  _Arr.length,
);

const createSubArrayOf = _Fn.flip(_Arr.dropNth<number>);

export function part2(input: Parsed) {
  const faultTolerantSafeLines = input.filter((line) => {
    return pipe(
      _Arr.range(0, line.length),
      _Arr.map(createSubArrayOf(line)),
      _Arr.prepend(line),
      _Arr.map((row) => [row]),
      _Arr.some(
        pipeline(part1, _Bool.gt(0)),
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
