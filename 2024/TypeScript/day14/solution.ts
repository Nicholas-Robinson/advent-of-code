import { _Arr } from "../utils/pipeline/_Arr.ts"
import { _Fn } from "../utils/pipeline/_Fn.ts"
import { _Num } from "../utils/pipeline/_Num.ts"
import { pipe } from "../utils/pipeline/_pipe.ts"
import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { _Str } from "../utils/pipeline/_Str.ts"
import type { Tuple } from "../utils/pipeline/_Tuple.ts"
import { _Tuple } from "../utils/pipeline/_Tuple.ts"

type Parsed = {
  width: number;
  height: number;
  times: number;
  input: Tuple<Tuple<number>>[];
};

export const parse = (raw: string) => {
  const [params, ...robots] = _Str.lines(raw);

  const [width, height, times] = pipe(
    params,
    _Str.matchGroups(/(\d+),(\d+),(\d+)/),
    _Arr.map(Number),
  );

  const input = pipe(
    robots,
    _Arr.map(
      pipeline(
        _Str.matchGroups(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/),
        _Arr.map(Number),
        _Arr.pairs,
        _Tuple.lift,
      ),
    ),
  );

  return { width, height, times, input };
};

export function part1({ width, height, times, input }: Parsed) {
  return pipe(
    input,
    solve(times, width, height),
    quad(width, height),
    _Num.multiplyAll,
  );
}

export function part2({ width, height, times, input }: Parsed) {
  const a = pipe(
    _Arr.range(0, times),
    _Arr.map((sample) => solve(sample, width, height)(input)),
    _Arr.map((coords) => print(coords, width, height)),
    _Arr.filter(x => x.some(y => {
      return (new RegExp(`1{10}1+`)).test(y.join("\n"))
    })),
    // _Arr.sort((a, b) => score(b) - score(a)),
    _Arr.map((a) =>
      a.map((b) => b.map((i) => i === 0 ? " " : "#").join("")).join("\n")
    ),
    _Arr.map((x, i) => _Fn.debug(`Sample ${i + 1}`)(x)),
  );

  return 1;
}

const score = (print: number[][]) =>
  pipe(print, _Arr.flatten, _Arr.filter((x) => x > 0), _Arr.length);

const applyMove = (len: number) => ([pos, move]: Tuple<number>) =>
  move > 0 ? (move + pos) % len : (len + (move % len) + pos) % len;

const solve =
  (times: number, width: number, height: number) =>
  (input: Tuple<Tuple<number>>[]) =>
    pipe(
      input,
      _Arr.map(
        pipeline(
          _Tuple.mapSecond(
            _Tuple.mapBoth(_Num.multiply(times), _Num.multiply(times)),
          ),
          _Arr.unzip,
          _Tuple.mapBoth(_Tuple.lift, _Tuple.lift),
          _Tuple.mapBoth(applyMove(width), applyMove(height)),
        ),
      ),
    );

function quad(width: number, height: number) {
  const xFrom = Math.floor(width / 2);
  const xTo = Math.ceil(width / 2);

  const yFrom = Math.floor(height / 2);
  const yTo = Math.ceil(height / 2);

  return ((coords: Tuple<number>[]) => {
    let tl = 0, tr = 0, bl = 0, br = 0;

    for (const [x, y] of coords) {
      if (x < xFrom && y < yFrom) tl++;
      if (x >= xTo && y < yFrom) tr++;
      if (x < xFrom && y >= yTo) bl++;
      if (x >= xTo && y >= yTo) br++;
    }

    return [tl, tr, bl, br];
  });
}

function print(coords: Tuple<number>[], width: number, height: number) {
  const print = Array.from(
    { length: height },
    () => Array.from({ length: width }, () => 0),
  );

  for (const [x, y] of coords) {
    print[y][x]++;
  }

  return print;
}
