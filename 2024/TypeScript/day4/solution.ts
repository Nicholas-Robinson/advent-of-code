import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { seededPipeline } from "../utils/pipeline/_seededPipeline.ts"
import { Arr } from "../utils/pipeline/Arr.ts"
import { Str } from "../utils/pipeline/Str.ts"

type Parsed = string[][];

export const parse = pipeline(Str.lines, Arr.map(Str.chars));

export function part1(input: Parsed) {
  return seededPipeline(
    input,
    Arr.flatMapNested((value, x, y) =>
      value === "X" ? buildXmasSamples(input, x, y) : []
    ),
    Arr.filter((c) => c === "XMAS"),
    Arr.length,
  );
}

const XMAS_DELTA_LIST = [
  [[0, 0], [-1, 0], [-2, 0], [-3, 0]], // To the left
  [[0, 0], [1, 0], [2, 0], [3, 0]], // To the right

  [[0, 0], [0, -1], [0, -2], [0, -3]], // Upward
  [[0, 0], [0, 1], [0, 2], [0, 3]], // Downward

  [[0, 0], [-1, -1], [-2, -2], [-3, -3]], // Upward left diagonal
  [[0, 0], [1, 1], [2, 2], [3, 3]], // Downward right diagonal

  [[0, 0], [1, -1], [2, -2], [3, -3]], // Upward right diagonal
  [[0, 0], [-1, 1], [-2, 2], [-3, 3]], // Downward left diagonal
] as [number, number][][];

function buildXmasSamples(input: Parsed, x: number, y: number) {
  return seededPipeline(
    XMAS_DELTA_LIST,
    Arr.mapNested(([dx, dy]) => input[y + dy]?.[x + dx]),
    Arr.map(Str.unchars),
  );
}

export function part2(input: Parsed) {
  return input;
}

const X_MAS_DELTA_LIST = [
  // Backward leaning diagonals
  [[-1, -1], [0, 0], [1, 1]],
  [[1, 1], [0, 0], [-1, -1]],

  // Forward leaning diagonals
  [[1, -1], [0, 0], [-1, 1]],
  [[-1, 1], [0, 0], [1, -1]],
] as [number, number][][];
