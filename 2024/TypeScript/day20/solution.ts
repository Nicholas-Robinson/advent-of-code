import { _Arr } from "../utils/pipeline/_Arr.ts"
import { _Bool } from "../utils/pipeline/_Bool.ts"
import { _Fn } from "../utils/pipeline/_Fn.ts"
import { _Num } from "../utils/pipeline/_Num.ts"
import { _Obj } from "../utils/pipeline/_Obj.ts"
import { pipe } from "../utils/pipeline/_pipe.ts"
import { _Str } from "../utils/pipeline/_Str.ts"
import { _Tuple } from "../utils/pipeline/_Tuple.ts"

const WALL = "#";
const EMPTY = ".";

type Parsed = (string | number)[][];

export function parse(raw: string): Parsed {
  const maze: string[][] = pipe(
    raw,
    _Str.lines,
    _Arr.map(_Str.chars),
  );

  const start = pipe(maze, _Arr.findIndexNested(_Bool.eq("S")));
  const end = pipe(maze, _Arr.findIndexNested(_Bool.eq("E")));

  const result = maze as Parsed;
  result[end[1]][end[0]] = EMPTY;

  let [x, y] = start;
  let steps = 0;
  while (!_Tuple.areEqual([x, y], end)) {
    result[y][x] = steps++;

    if (result[y]?.[x + 1] === EMPTY) [x, y] = [x + 1, y];
    else if (result[y]?.[x - 1] === EMPTY) [x, y] = [x - 1, y];
    else if (result[y + 1]?.[x] === EMPTY) [x, y] = [x, y + 1];
    else if (result[y - 1]?.[x] === EMPTY) [x, y] = [x, y - 1];
  }

  result[end[1]][end[0]] = steps;

  return result;
}

const isHorizontalCheatSite = (input: Parsed, x: number, y: number) =>
  _Num.isNumber(input[y]?.[x + 1]) && _Num.isNumber(input[y]?.[x - 1]);

const isVerticalCheatSite = (input: Parsed, x: number, y: number) =>
  _Num.isNumber(input[y + 1]?.[x]) && _Num.isNumber(input[y - 1]?.[x]);

export function part1(input: Parsed) {
  return pipe(
    input,
    // Build list of possible cheat sites
    _Arr.mapNested((item, x, y) => {
      const target = item === WALL && (
        isHorizontalCheatSite(input, x, y) || isVerticalCheatSite(input, x, y)
      );

      return [item, target, [x, y]] as const;
    }),
    _Arr.filterNested(([_, keep]) => keep),
    _Arr.mapNested(([_, __, pos]) => pos),
    _Arr.flatten,
    // Figure out how much time is saved
    _Arr.map(([x, y]) => {
      const isHorizontal = isHorizontalCheatSite(input, x, y);
      const [ax, ay] = isHorizontal ? [x - 1, y] : [x, y - 1];
      const [bx, by] = isHorizontal ? [x + 1, y] : [x, y + 1];

      const from = input[ay][ax];
      const to = input[by][bx];

      if (!_Num.isNumber(from) || !_Num.isNumber(to)) throw "WAT??";

      return Math.abs(from - to) - 2;
    }),
    _Arr.groupBy(_Fn.identity),
    _Obj.entries,
    _Arr.map(_Tuple.mapBoth(Number, _Arr.length)),
    // Find how many sites save 100 or more steps
    _Arr.filter(([count]) => count >= 100),
    _Arr.map(_Tuple.second),
    _Num.sumAll,
  );
}

export function part2(input: Parsed) {
  return input;
}
