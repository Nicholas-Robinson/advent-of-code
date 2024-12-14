import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { _Tuple } from "../utils/pipeline/_Tuple.ts";

type InputPart = [number, number[]];
type Fn = (n: number) => number;

type DuoNode = [_Fn, _Fn];
type DuoEquation = [answer: number, tree: DuoNode[]];

type TrioNode = [_Fn, _Fn, _Fn];
type TrioEquation = [answer: number, tree: TrioNode[]];

export const parse = pipeline(
  _Str.lines,
  _Arr.map(_Str.bisect(": ")),
  _Arr.map(
    _Tuple.mapBoth(
      Number,
      pipeline(_Str.split(" "), _Arr.map(Number)),
    ),
  ),
);

const toDuoCompilationBranch = (n: number) =>
  [_Num.add(n), _Num.multiply(n)] as DuoNode;

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
  _Arr.map<InputPart, DuoEquation>(
    _Tuple.mapSecond(_Arr.map(toDuoCompilationBranch)),
  ),
  _Arr.filter(isDuoCalibrationPossible),
  _Arr.map(_Tuple.first),
  _Num.sumAll,
);

const concatOperator = (a: number) => (b: number) => Number(`${b}${a}`);

const toTrioCompilationBranch = (n: number) =>
  [_Num.add(n), _Num.multiply(n), concatOperator(n)] as TrioNode;

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
  _Arr.map<InputPart, TrioEquation>(
    _Tuple.mapSecond(_Arr.map(toTrioCompilationBranch)),
  ),
  _Arr.filter(isTrioCalibrationPossible),
  _Arr.map(_Tuple.first),
  _Num.sumAll,
);
