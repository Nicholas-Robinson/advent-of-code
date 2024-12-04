import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { seededPipeline } from "../utils/pipeline/_seededPipeline.ts"
import { Arr } from "../utils/pipeline/Arr.ts"
import { Bool } from "../utils/pipeline/Bool.ts"
import { Fn } from "../utils/pipeline/Fn.ts"
import { Str } from "../utils/pipeline/Str.ts"

type DeltaList = [number, number][][];

const XMAS_DELTA_LIST = [
  [[0, 0], [-1, 0], [-2, 0], [-3, 0]], // To the left
  [[0, 0], [1, 0], [2, 0], [3, 0]], // To the right

  [[0, 0], [0, -1], [0, -2], [0, -3]], // Upward
  [[0, 0], [0, 1], [0, 2], [0, 3]], // Downward

  [[0, 0], [-1, -1], [-2, -2], [-3, -3]], // Upward left diagonal
  [[0, 0], [1, 1], [2, 2], [3, 3]], // Downward right diagonal

  [[0, 0], [1, -1], [2, -2], [3, -3]], // Upward right diagonal
  [[0, 0], [-1, 1], [-2, 2], [-3, 3]], // Downward left diagonal
] as DeltaList;

const X_MAS_DELTA_LIST = [
  [[-1, -1], [0, 0], [1, 1]], // Backward leaning diagonals
  [[1, -1], [0, 0], [-1, 1]], // Forward leaning diagonals
] as DeltaList;

type Parsed = string[][];

export const parse = pipeline(Str.lines, Arr.map(Str.chars));

export function part1(input: Parsed) {
  return seededPipeline(
    input,
    Arr.flatMapNested((value, x, y) =>
      value === "X" ? buildXmasSamples(XMAS_DELTA_LIST, input, x, y) : []
    ),
    Arr.filter((c) => c === "XMAS"),
    Arr.length,
  );
}

export function part2(input: Parsed) {
  return seededPipeline(
    input,
    // Get all the crossing words (all much start with "A" so we can short-circuit all the other searched)
    Arr.mapNested((value, x, y) =>
      value === "A" ? buildXmasSamples(X_MAS_DELTA_LIST, input, x, y) : []
    ),
    // We can remove all those that are empty as they are not going to be crossing "MAS"
    Arr.filterNested(pipeline(Arr.length, Bool.neq(0))),
    // Remove all those that are not crossing "MAS"
    Arr.filterNested(
      Arr.every(
        Bool.passAny(Bool.eq("MAS"), Bool.eq("SAM")),
      ),
    ),
    // Clean up and count

    Arr.flatMap(Fn.identity),
    Arr.length,
  );
}

function buildXmasSamples(
  deltas: DeltaList,
  input: Parsed,
  x: number,
  y: number,
) {
  return seededPipeline(
    deltas,
    Arr.mapNested(([dx, dy]) => input[y + dy]?.[x + dx]),
    Arr.map(Str.unchars),
  );
}
