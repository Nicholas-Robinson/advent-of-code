import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { seededPipeline } from "../utils/pipeline/_seededPipeline.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Obj } from "../utils/pipeline/Obj.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { Tuple } from "../utils/pipeline/Tuple.ts";

type Cood = [x: number, y: number];
type Parsed = [Cood, string[]];

export function parse(raw: string): Parsed {
  const lines = Str.lines(raw);

  const y = lines.findIndex((line) => line.includes("^"));
  const x = lines[y].indexOf("^");

  return [[x, y], lines];
}

export function part1([[x, y], lines]: Parsed) {
  let direction: Cood = [0, -1]; // Up
  let position: Cood = [x, y];

  const path: Record<number, Record<number, true>> = {};
  trackPath(path, position);

  while (lookDownAndSee(position, lines) !== undefined) {
    const lookForwardAndSee1 = lookForwardAndSee(position, direction, lines);
    if (lookForwardAndSee1 === "#") {
      direction = turnRight(direction);
      continue;
    }

    position = stepForward(position, direction);
    trackPath(path, position);
  }

  printPath(path, lines);

  return seededPipeline(
    path,
    Obj.mapValues(pipeline(Obj.keys, Arr.length)),
    Obj.values,
    Num.sumAll,
    Num.subtract(1),
  );
}

export function part2(input: Parsed) {
  return input;
}

function lookDownAndSee([x, y]: Cood, lines: string[]): string | undefined {
  return lines[y]?.[x];
}

function lookForwardAndSee(
  [x, y]: Cood,
  [dx, dy]: Cood,
  lines: string[],
): string | undefined {
  return lines[y + dy]?.[x + dx];
}

function stepForward([x, y]: Cood, [dx, dy]: Cood): Cood {
  return [x + dx, y + dy];
}

function turnRight([dx, dy]: Cood): Cood {
  return [-dy, dx];
}

function trackPath(
  path: Record<number, Record<number, true>>,
  [x, y]: Cood,
): void {
  path[y] = path[y] ?? {};
  path[y][x] = true;
}

function printPath(
  path: Record<number, Record<number, true>>,
  lines: string[],
): void {
  const steps = seededPipeline(
    path,
    Obj.mapValues(Obj.keys),
    Obj.entries,
    Arr.map(Tuple.mapBoth(Number, Arr.map(Number))),
  );

  const pint = lines.slice().map((line) => line.slice().split(""));
  steps.forEach(([y, xs]) => {
    if (pint[y] === undefined) return;
    xs.forEach((x) => {
      pint[y][x] = "X";
    });
  });

  console.log(pint.map((line) => line.join("")).join("\n"));
}
