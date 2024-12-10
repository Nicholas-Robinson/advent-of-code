import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Bool } from "../utils/pipeline/Bool.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { Tuple } from "../utils/pipeline/Tuple.ts";

type Cood = [x: number, y: number];
type Vec = [Cood, Cood];

type Parsed = [Cood, string[]];

export const parse = pipeline(
  Str.lines,
  Arr.map(Str.chars),
  Tuple.pairWith(Arr.findIndexNested(Bool.eq("^"))),
  Tuple.mapFirst(Arr.map(Str.unchars)),
  Tuple.swap,
);

export function part1([[x, y], lines]: Parsed) {
  return pipe(
    getPath(lines, [x, y]),
    Arr.unique,
    Arr.length,
    Num.subtract(1),
  );
}

export function part2([[x, y], lines]: Parsed) {
  return pipe(
    getPath(lines, [x, y]),
    Arr.unique,
    Arr.flatMap(addNewTestBlock(lines)),
    Arr.map((path) => getPath(path, [x, y])),
    Arr.filter(pointsAtSomething(lines)),
    Arr.length,
  );
}

const getPath = (lines: string[], position: Cood) =>
  pipe(
    [[position, [0, -1]]] as Vec[],
    Arr.generateNextUntil(
      takeStepOrTurnRight(lines),
      isTheEndOfThePath(lines),
    ),
    Arr.map(Tuple.first),
  );

const isTheEndOfThePath = (lines: string[]) =>
  Bool.passAny([
    isWalkingInALoop,
    lookDownAndSeeNothing(lines),
  ]);

const takeStepOrTurnRight = (lines: string[]) =>
  Bool.branch(
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
    Arr.last<Cood>,
    ([x, y]) => lines[y]?.[x] !== undefined,
  );

const addNewTestBlock = (lines: string[]) => ([ux, uy]: Cood) => {
  const clone = lines.map(Str.chars);

  if (clone[uy] === undefined || clone[uy][ux] === undefined) return [];
  if (clone[uy][ux] !== ".") return [];
  clone[uy][ux] = "#";

  return [clone.map(Str.unchars)];
};
