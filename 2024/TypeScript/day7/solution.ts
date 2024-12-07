import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { Arr } from "../utils/pipeline/Arr.ts"
import { Fn } from "../utils/pipeline/Fn.ts"
import { Num } from "../utils/pipeline/Num.ts"
import { Str } from "../utils/pipeline/Str.ts"
import { Tuple } from "../utils/pipeline/Tuple.ts"

type Fn = (n: number) => number;
type Node = [Fn, Fn];
type Equation = [answer: number, tree: Node[]];

type InputPart = [number, number[]];
type Parsed = InputPart[];

export const parse = pipeline(
  Str.lines,
  Arr.map(Str.bisect(": ")),
  Arr.map(
    Tuple.mapBoth(
      Number,
      pipeline(Str.split(" "), Arr.map(Number)),
    ),
  ),
);

const toCompilationBranch = (n: number) =>
  [Num.add(n), Num.multiply(n)] as Node;

const isThing = ([answer, [[add, mul], ...tail]]: Equation) => {
  return searchFor(tail, add(0), answer) || searchFor(tail, mul(1), answer);
};

export const part1 = pipeline(
  Arr.map<InputPart, Equation>(Tuple.mapSecond(Arr.map(toCompilationBranch))),
  Arr.filter(isThing),
  Arr.map(Tuple.first),
  Num.sumAll,
);

const searchFor = (
  [[add, mul], ...tail]: Node[],
  test: number,
  answer: number,
): boolean => {
  if (tail.length === 0) return add(test) === answer || mul(test) === answer;
  return searchFor(tail, add(test), answer) ||
    searchFor(tail, mul(test), answer);
};

export function part2(input: Parsed) {
  return input;
}
