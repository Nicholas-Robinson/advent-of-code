import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { Arr } from "../utils/pipeline/Arr.ts"
import { Fn } from "../utils/pipeline/Fn.ts"
import { Num } from "../utils/pipeline/Num.ts"
import { Str } from "../utils/pipeline/Str.ts"
import { Tuple } from "../utils/pipeline/Tuple.ts"

type InputPart = [number, number[]];
type Fn = (n: number) => number;

type DuoNode = [Fn, Fn];
type DuoEquation = [answer: number, tree: DuoNode[]];

type TrioNode = [Fn, Fn, Fn];
type TrioEquation = [answer: number, tree: TrioNode[]];

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

const toDuoCompilationBranch = (n: number) =>
  [Num.add(n), Num.multiply(n)] as DuoNode;

const isDuoCalibrationPossible = (
  [answer, [[add, mul], ...tail]]: DuoEquation,
) => {
  return testDuoCalibration(tail, add(0), answer) ||
    testDuoCalibration(tail, mul(1), answer);
};

const testDuoCalibration = (
  [[add, mul], ...tail]: DuoNode[],
  test: number,
  answer: number,
): boolean => {
  if (tail.length === 0) return add(test) === answer || mul(test) === answer;
  return testDuoCalibration(tail, add(test), answer) ||
    testDuoCalibration(tail, mul(test), answer);
};

export const part1 = pipeline(
  Arr.map<InputPart, DuoEquation>(
    Tuple.mapSecond(Arr.map(toDuoCompilationBranch)),
  ),
  Arr.filter(isDuoCalibrationPossible),
  Arr.map(Tuple.first),
  Num.sumAll,
);

const concatOperator = (a: number) => (b: number) => Number(`${b}${a}`);

const toTrioCompilationBranch = (n: number) =>
  [Num.add(n), Num.multiply(n), concatOperator(n)] as TrioNode;

const isTrioCalibrationPossible = (
  [answer, [[add, mul, concat], ...tail]]: TrioEquation,
) =>
  testTrioCalibration(tail, add(0), answer) ||
  testTrioCalibration(tail, mul(1), answer) ||
  testTrioCalibration(tail, concat(0), answer);

const testTrioCalibration = (
  [[add, mul, concat], ...tail]: TrioNode[],
  test: number,
  answer: number,
): boolean => {
  if (tail.length === 0) {
    return add(test) === answer || mul(test) === answer ||
      concat(test) === answer;
  }
  return testTrioCalibration(tail, add(test), answer) ||
    testTrioCalibration(tail, mul(test), answer) ||
    testTrioCalibration(tail, concat(test), answer);
};

export const part2 = pipeline(
  Arr.map<InputPart, TrioEquation>(
    Tuple.mapSecond(Arr.map(toTrioCompilationBranch)),
  ),
  Arr.filter(isTrioCalibrationPossible),
  Arr.map(Tuple.first),
  Num.sumAll,
);
