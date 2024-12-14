import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Bool } from "../utils/pipeline/_Bool.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { _Tuple } from "../utils/pipeline/_Tuple.ts";

type Cood = [x: number, y: number];
type Vec = [Cood, Cood];

type Parsed = [Cood, string[]];

export const parse = pipeline(
  _Str.lines,
  _Arr.map(_Str.chars),
  _Tuple.pairWith(_Arr.findIndexNested(_Bool.eq("^"))),
  _Tuple.mapFirst(_Arr.map(_Str.unchars)),
  _Tuple.swap,
);

export function part1([[x, y], lines]: Parsed) {
  return pipe(
    getPath(lines, [x, y]),
    _Arr.unique,
    _Arr.length,
    _Num.subtract(1),
  );
}

export function part2([[x, y], lines]: Parsed) {
  return pipe(
    getPath(lines, [x, y]),
    _Arr.unique,
    _Arr.flatMap(addNewTestBlock(lines)),
    _Arr.map((path) => getPath(path, [x, y])),
    _Arr.filter(pointsAtSomething(lines)),
    _Arr.length,
  );
}

const getPath = (lines: string[], position: Cood) =>
  pipe(
    [[position, [0, -1]]] as Vec[],
    _Arr.generateNextUntil(
      takeStepOrTurnRight(lines),
      isTheEndOfThePath(lines),
    ),
    _Arr.map(_Tuple.first),
  );

const isTheEndOfThePath = (lines: string[]) =>
  _Bool.passAny([
    isWalkingInALoop,
    lookDownAndSeeNothing(lines),
  ]);

const takeStepOrTurnRight = (lines: string[]) =>
  _Bool.branch(
    lookForwardAndSeeObstetrical(lines),
    turnRightSlim,
    stepForwardSlim,
  );

const isWalkingInALoop = ([[x, y], [dx, dy]]: Vec, path: Vec[]) => {
  // There is an edge case where it will loop forever and I have no idea why...
  if (path.length > 60000) {
    return true;
  }

  const firstIndex = path.findIndex(([pos]) => pos[0] === x && pos[1] === y);
  if (firstIndex === -1) return false;

  const first = path[firstIndex];
  const second = path[firstIndex + 1];

  if (first === undefined || second === undefined) return false;

  const [fx, fy] = first[0];
  const [sx, sy] = second[0];

  return fx === x && fy === y && sx === x + dx && sy === y + dy;
};

const lookDownAndSeeNothing = (lines: string[]) => ([[x, y]]: Vec) =>
  lines[y]?.[x] === undefined;

const lookForwardAndSeeObstetrical =
  (lines: string[]) => ([[x, y], [dx, dy]]: Vec) =>
    lines[y + dy]?.[x + dx] === "#";

const stepForwardSlim = (
  [[x, y], [dx, dy]]: Vec,
): Vec => [[x + dx, y + dy], [dx, dy]];

const turnRightSlim = ([[x, y], [dx, dy]]: Vec): Vec => [[x, y], [-dy, dx]];

const pointsAtSomething = (lines: string[]) =>
  pipeline(
    _Arr.last<Cood>,
    ([x, y]) => lines[y]?.[x] !== undefined,
  );

const addNewTestBlock = (lines: string[]) => ([ux, uy]: Cood) => {
  const clone = lines.map(_Str.chars);

  if (clone[uy] === undefined || clone[uy][ux] === undefined) return [];
  if (clone[uy][ux] !== ".") return [];
  clone[uy][ux] = "#";

  return [clone.map(_Str.unchars)];
};
