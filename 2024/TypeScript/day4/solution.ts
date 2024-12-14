import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Bool } from "../utils/pipeline/_Bool.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Str } from "../utils/pipeline/_Str.ts";

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

export const parse = pipeline(_Str.lines, _Arr.map(_Str.chars));

export function part1(input: Parsed) {
  return pipe(
    input,
    _Arr.flatMapNested((value, x, y) =>
      value === "X" ? buildXmasSamples(XMAS_DELTA_LIST, input, x, y) : []
    ),
    _Arr.filter((c) => c === "XMAS"),
    _Arr.length,
  );
}

export function part2(input: Parsed) {
  return pipe(
    input,
    // Get all the crossing words (all much start with "A" so we can short-circuit all the other searched)
    _Arr.mapNested((value, x, y) =>
      value === "A" ? buildXmasSamples(X_MAS_DELTA_LIST, input, x, y) : []
    ),
    // We can remove all those that are empty as they are not going to be crossing "MAS"
    _Arr.filterNested(pipeline(_Arr.length, _Bool.neq(0))),
    // Remove all those that are not crossing "MAS"
    _Arr.filterNested(
      _Arr.every(
        _Bool.passAny([_Bool.eq("MAS"), _Bool.eq("SAM")]),
      ),
    ),
    // Clean up and count

    _Arr.flatMap(_Fn.identity),
    _Arr.length,
  );
}

function buildXmasSamples(
  deltas: DeltaList,
  input: Parsed,
  x: number,
  y: number,
) {
  return pipe(
    deltas,
    _Arr.mapNested(([dx, dy]) => input[y + dy]?.[x + dx]),
    _Arr.map(_Str.unchars),
  );
}
