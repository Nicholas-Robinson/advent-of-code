import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Bool } from "../utils/pipeline/_Bool.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { _Tuple, Tuple } from "../utils/pipeline/_Tuple.ts";

type Direction = "^" | ">" | "v" | "<";
type Parsed = Tuple<string[][], Direction[]>;
type Parser = (input: string) => Parsed;

const WALL = "#";
const FLOOR = ".";
const ROBOT = "@";
const BOX = "O";

const LEFT_WALL = "[";
const RIGHT_WALL = "]";

const DIR: Record<Direction, Tuple<number>> = {
  "^": [0, -1],
  ">": [1, 0],
  "v": [0, 1],
  "<": [-1, 0],
};

const parseMap = pipeline(_Str.lines, _Arr.map(_Str.chars));

export const parse: Parser = pipeline(
  _Str.bisect("\n\n"),
  _Tuple.mapBoth(parseMap, _Str.chars),
  _Tuple.mapSecond(_Arr.filter(_Bool.neq("\n"))),
  _Tuple.mapSecond((instruction) => instruction as Direction[]),
);

export function part1([map, instructions]: Parsed) {
  let [rx, ry] = pipe(map, _Arr.findIndexNested((item) => item === ROBOT));

  for (const instruction of instructions) {
    const direction = DIR[instruction];
    if (swap([rx, ry], direction, map)) {
      [rx, ry] = [rx + _Tuple.first(direction), ry + _Tuple.second(direction)];
    }
    // console.log("\n\n");
    // console.log("Move :", instruction);
    // console.log(print(map));
  }

  return pipe(
    map,
    _Arr.mapNested((item, x, y) => [item, x, y] as const),
    _Arr.filterNested(([item]) => item === BOX),
    _Arr.mapNested(([_, x, y]) => _Tuple.from(x, y)),
    _Arr.mapNested(
      pipeline(
        _Tuple.mapSecond(_Num.multiply(100)),
        _Num.sumAll,
      ),
    ),
    _Arr.flatten,
    _Num.sumAll,
  );
}

export function part2([map, instructions]: Parsed) {
  const expandedMap = pipe(
    map,
    _Arr.mapNested((item) => {
      if (item === FLOOR) return [FLOOR, FLOOR];
      if (item === BOX) return ["[", "]"];
      if (item === WALL) return [WALL, WALL];
      return [ROBOT, FLOOR];
    }),
    _Arr.map(_Arr.flatMap(_Fn.identity)),
  );

  let [rx, ry] = pipe(
    expandedMap,
    _Arr.findIndexNested((item) => item === ROBOT),
  );

  for (const instruction of instructions) {
    const direction = DIR[instruction];
    const didMove = instruction === "v" || instruction === "^"
      ? swapDoubleV([[rx, ry]], direction, expandedMap)
      : swap([rx, ry], direction, expandedMap);

    if (didMove) {
      [rx, ry] = [rx + _Tuple.first(direction), ry + _Tuple.second(direction)];
    }
    console.log("\n\n");
    console.log("Move :", instruction);
    console.log(print(expandedMap));
  }

  // for (let x = 0; x < 4; x++) {
  //   if (swap([rx, ry], DIR[">"], expandedMap)) {
  //     [rx, ry] = [rx + DIR[">"][0], ry + DIR[">"][1]];
  //   }
  // }
  //
  // console.log(print(expandedMap));
  //
  // [rx, ry] = pipe(
  //   expandedMap,
  //   _Arr.findIndexNested((item) => item === ROBOT),
  // );
  // for (let x = 0; x < 2; x++) {
  //   if (swapDoubleV([[rx, ry]], DIR["v"], expandedMap)) {
  //     [rx, ry] = [rx + DIR["v"][0], ry + DIR["v"][1]];
  //   }
  //   console.log(print(expandedMap));
  // }
  //
  // return undefined;
}

function swap(
  [x, y]: Tuple<number>,
  [dx, dy]: Tuple<number>,
  warehouse: string[][],
): boolean {
  const nx = x + dx, ny = y + dy;
  const next = warehouse[ny]?.[nx];

  if (!next || next === WALL) return false;

  if (next === FLOOR) {
    warehouse[ny][nx] = warehouse[y][x];
    warehouse[y][x] = FLOOR;
    return true;
  }

  const doesMove = swap([nx, ny], [dx, dy], warehouse);
  if (!doesMove) return false;

  warehouse[ny][nx] = warehouse[y][x];
  warehouse[y][x] = FLOOR;

  return true;
}

function swapDoubleV(
  [first, second]: [Tuple<number>, Tuple<number>?],
  [dx, dy]: Tuple<number>,
  warehouse: string[][],
) {
  const [fx, fy] = first;
  const [fnx, fny] = [fx + dx, fy + dy];
  const firstNext = warehouse[fny]?.[fnx];

  const current = warehouse[fy][fx];
  let other = second ?? first;
  if (_Tuple.areEqual(other, first) && current === LEFT_WALL) {
    other = [fx + 1, fy];
  }
  if (_Tuple.areEqual(other, first) && current === RIGHT_WALL) {
    other = [fx - 1, fy];
  }

  const [sx, sy] = other;
  const [snx, sny] = [sx + dx, sy + dy];
  const secondNext = warehouse[sny]?.[snx];

  if (!firstNext || firstNext === WALL) return false;
  if (!secondNext || secondNext === WALL) return false;

  if (firstNext === FLOOR && secondNext === FLOOR) {
    warehouse[fny][fnx] = warehouse[fy][fx];
    warehouse[sny][snx] = warehouse[sy][sx];
    warehouse[fy][fx] = FLOOR;
    warehouse[sy][sx] = FLOOR;
    return true;
  }

  if (!swapDoubleV([[fnx, fny], [snx, sny]], [dx, dy], warehouse)) return false;

  warehouse[fny][fnx] = warehouse[fy][fx];
  warehouse[sny][snx] = warehouse[sy][sx];
  warehouse[fy][fx] = FLOOR;
  warehouse[sy][sx] = FLOOR;

  return true;
}

function print(warehouse: string[][]) {
  return warehouse.map((row) => row.join("")).join("\n");
}
