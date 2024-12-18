import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { _Tuple, Tuple } from "../utils/pipeline/_Tuple.ts";

type Parsed = string[][];

const EAST = _Tuple.from(1, 0);
const WEST = _Tuple.from(-1, 0);
const NORTH = _Tuple.from(0, -1);
const SOUTH = _Tuple.from(0, 1);

export function parse(raw: string): Parsed {
  return pipe(
    raw,
    _Str.lines,
    _Arr.map(_Str.chars),
  );
}

export function part1(input: Parsed) {
  const map = pipe(
    input,
    _Arr.mapNested((c) => c === "." || c === "S" ? Infinity : null),
  );

  const start = pipe(
    input,
    _Arr.findIndexNested((x) => x === "S"),
    _Tuple.lift,
  );

  const end = pipe(input, _Arr.findIndexNested((x) => x === "E"), _Tuple.lift);
  const [ex, ey] = end;
  map[ey][ex] = Infinity;

  const toProcess: [Tuple<number>, Tuple<number>, number][] = [[
    start,
    EAST,
    0,
  ]];

  while (toProcess.length) {
    const [[x, y], [dx, dy], cost] = toProcess.shift()!;
    const current = map[y][x];

    if (current === null) continue;
    if (current < cost) continue;

    map[y][x] = cost;

    const forward = _Tuple.from(x + dx, y + dy);
    toProcess.push([forward, [dx, dy], cost + 1]);

    const left = turnLeft([dx, dy]);
    const leftPos = _Tuple.from(x + left[0], y + left[1]);
    toProcess.push([leftPos, left, cost + 1001]);

    const right = turnRight([dx, dy]);
    const rightPos = _Tuple.from(x + right[0], y + right[1]);
    toProcess.push([rightPos, right, cost + 1001]);
  }

  return map[end[1]][end[0]];
}

export function part2(input: Parsed) {
  const map = pipe(
    input,
    _Arr.mapNested((c) => c === "." || c === "S" ? Infinity : null),
  );

  const start = pipe(
    input,
    _Arr.findIndexNested((x) => x === "S"),
    _Tuple.lift,
  );

  const end = pipe(input, _Arr.findIndexNested((x) => x === "E"), _Tuple.lift);
  const [ex, ey] = end;
  map[ey][ex] = Infinity;

  const toProcess: [Tuple<number>, Tuple<number>, number][] = [[
    start,
    EAST,
    0,
  ]];

  while (toProcess.length) {
    const [[x, y], [dx, dy], cost] = toProcess.shift()!;
    const current = map[y][x];

    if (current === null) continue;
    if (current < cost) continue;

    map[y][x] = cost;

    const forward = _Tuple.from(x + dx, y + dy);
    toProcess.push([forward, [dx, dy], cost + 1]);

    const left = turnLeft([dx, dy]);
    const leftPos = _Tuple.from(x + left[0], y + left[1]);
    toProcess.push([leftPos, left, cost + 1001]);

    const right = turnRight([dx, dy]);
    const rightPos = _Tuple.from(x + right[0], y + right[1]);
    toProcess.push([rightPos, right, cost + 1001]);
  }

  console.log(
    map.map((x) => x.map((y) => y?.toString() ?? "#").join("\t")).join("\n"),
  );
  const toTest: [Tuple<number>, number][] = [[start, 0]];
  const paths: Tuple<number>[][] = [[start]];

  while (toTest.length) {
    const [[x, y], pathIndex] = toTest.shift()!;

    if (_Tuple.areEqual([x, y], end)) continue;

    const path = paths[pathIndex];
    const current = map[y][x];

    const [firstPath, ...possiblePaths] = pipe(
      [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]],
      _Arr.filter(([x, y]) => map[y]?.[x] !== null),
      _Arr.filter(([x, y]) => map[y]?.[x]! % 1000 <= current! + 1),
      _Arr.map(_Tuple.lift),
    );

    for (const possiblePath of possiblePaths) {
      const index = paths.push([...path, possiblePath]) - 1;
      toTest.push([possiblePath, index]);
    }

    if (firstPath) {
      path.push(firstPath);
      toTest.push([firstPath, pathIndex]);
    }

    map[y][x] = null;
  }

  const final = pipe(
    paths,
    _Arr.filter((path) =>
      pipe(
        path,
        _Arr.last,
        (last) => _Tuple.areEqual(last, end),
      )
    ),
    _Arr.map(_Arr.length),
    _Num.sumAll,
  );

  console.log(final);

  return undefined;
}

// function walk(
//   pos: Tuple<number>,
//   direction: Tuple<number>,
//   map: Parsed,
//   visited: [Tuple<number>, boolean][] = [],
// ): [Tuple<number>, boolean][][] {
//   const [x, y] = pos;
//
//   if (visited.some(([seen]) => _Tuple.areEqual(pos, seen))) {
//     return [];
//   }
//
//   const current = map[y]?.[x];
//   if (!current || current === "#") return [];
//   if (current === "E") {
//     console.log("FOUND EXIT");
//     return [visited];
//   }
//
// return _Arr.flatten([
//   walk(
//     dotSum(pos, direction),
//     direction,
//     map,
//     pipe(visited, _Arr.append(_Tuple.from(pos, false))),
//   ),
//   walk(
//     dotSum(pos, turnLeft(direction)),
//     turnLeft(direction),
//     map,
//     pipe(visited, _Arr.append(_Tuple.from(pos, true))),
//   ),
//   walk(
//     dotSum(pos, turnRight(direction)),
//     turnRight(direction),
//     map,
//     pipe(visited, _Arr.append(_Tuple.from(pos, true))),
//   ),
// ]);

// const [x, y] = pos;
//
// if (visited.some((seen) => _Tuple.areEqual(pos, seen))) {
//   const cnt = a.get(`${x},${y}`) || 0
//   a.set(`${x},${y}`, cnt + 1)
//
//   if (cnt > 100) {
//     console.log("INFINITE LOOP", pos);
//     return Infinity
//   }
//
//   console.log("VISITED", pos);
//   return Infinity;
// }
// visited.push(pos);
//
// // console.log("AT", map[y]?.[x], pos);
//
// const next = map[y]?.[x];
// if (!next || next === "#") return Infinity;
// if (next === "E") return 0
//
// // console.log("MOVING FORWARD", map[y][x]);
// const forwardPos = dotSum(pos, direction);
// const forward = 1 + walk(forwardPos, direction, map, visited.slice());
//
// // console.log("MOVING LEFT", map[y][x]);
// const leftDirection = turnLeft(direction);
// const leftPos = dotSum(pos, leftDirection);
// const left = 1001 + walk(leftPos, leftDirection, map, visited.slice());
//
// // console.log("MOVING RIGHT", map[y][x]);
// const rightDirection = turnRight(direction);
// const rightPos = dotSum(pos, rightDirection);
// const right = 1001 + walk(rightPos, rightDirection, map, visited.slice());

// console.log("MOVING LEFT", map[y][x]);
// console.log("MOVING RIGHT", map[y][x]);
// const right = 1000 + walk(dotSum(pos, SOUTH), map, visited);

// console.log("BACKING UP");

// return Math.min(forward, left, right);
// }
//
function turnRight([dx, dy]: Tuple<number>): Tuple<number> {
  return [dy, -dx];
}

function turnLeft([dx, dy]: Tuple<number>): Tuple<number> {
  return [-dy, dx];
}
//
// function dotSum(
//   [x1, y1]: Tuple<number>,
//   [x2, y2]: Tuple<number>,
// ): Tuple<number> {
//   return [x1 + x2, y1 + y2];
// }
//
// function printMap(map: Parsed, things: [Tuple<number>, boolean][]) {
//   const copy = map.map((x) => [...x]);
//   things.forEach(([pos, turn]) => {
//     const [x, y] = pos;
//     copy[y][x] = turn ? "T" : "X";
//   });
//   console.log(copy.map((x) => x.join("")).join("\n"));
// }
