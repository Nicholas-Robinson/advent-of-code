import { seededPipeline } from "../utils/pipeline/_seededPipeline.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Bool } from "../utils/pipeline/Bool.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { Tuple } from "../utils/pipeline/Tuple.ts";

type Cood = [x: number, y: number];
type Vec = [Cood, Cood];

type Parsed = [Cood, string[]];

export function parse(raw: string): Parsed {
  const lines = Str.lines(raw);

  const y = lines.findIndex((line) => line.includes("^"));
  const x = lines[y].indexOf("^");

  return [[x, y], lines];
}

export function part1([[x, y], lines]: Parsed) {
  return seededPipeline(
    [[[x, y], [0, -1]]] as Vec[],
    Arr.generateNextUntil(
      takeStepOrTurnRight(lines),
      lookDownAndSeeNothing(lines),
    ),
    Arr.map(Tuple.first),
    Arr.unique,
    Arr.length,
    Num.subtract(1),
  );
}

export function part2(input: Parsed) {
  return input;
}

const takeStepOrTurnRight = (lines: string[]) =>
  Bool.branch(
    lookForwardAndSeeObstetrical(lines),
    turnRightSlim,
    stepForwardSlim,
  );

const lookDownAndSeeNothing = (lines: string[]) => ([[x, y]]: Vec) =>
  lines[y]?.[x] === undefined;

const lookForwardAndSeeObstetrical =
  (lines: string[]) => ([[x, y], [dx, dy]]: Vec) =>
    lines[y + dy]?.[x + dx] === "#";

const stepForwardSlim = (
  [[x, y], [dx, dy]]: Vec,
): Vec => [[x + dx, y + dy], [dx, dy]];

const turnRightSlim = ([[x, y], [dx, dy]]: Vec): Vec => [[x, y], [-dy, dx]];
