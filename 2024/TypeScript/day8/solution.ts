import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Bool } from "../utils/pipeline/_Bool.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Obj } from "../utils/pipeline/_Obj.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { _Tuple } from "../utils/pipeline/_Tuple.ts";

type Node = [x: number, y: number];
type Parsed = { map: string[]; nodes: Record<string, Node[]> };

export function parse(raw: string): Parsed {
  const map = _Str.lines(raw);

  const nodes = pipe(
    map,
    _Arr.map(_Str.chars),
    _Arr.mapNested((char, x, y) => [char, [x, y]] as [string, Node]),
    _Arr.flatten,
    _Arr.filter(([char]) => char !== "."),
    _Arr.groupBy(_Tuple.first),
    _Obj.mapValues(_Arr.map(_Tuple.second)),
  );

  return { map, nodes };
}

export function part1(input: Parsed) {
  return pipe(
    input.nodes,
    _Obj.mapValues(_Arr.combinationPairs),
    _Obj.mapValues(_Arr.map((pair) => [
      findAntinode(pair),
      findAntinode(_Tuple.swap(pair)),
    ])),
    _Obj.values,
    _Arr.flatMapNested(_Fn.identity),
    _Arr.filter(_Bool.invert(isOutOfBounds(input.map))),
    _Arr.unique,
    _Fn.tap(print(input.map)),
    _Arr.length,
  );
}

export function part2(input: Parsed) {
  return pipe(
    input.nodes,
    _Obj.mapValues(_Arr.combinationPairs),
    _Obj.mapValues(_Arr.map(findAllAntinodes)),
    _Obj.values,
    _Arr.flatMapNested(_Fn.identity),
    _Arr.filter(_Bool.invert(isOutOfBounds(input.map))),
    _Fn.debug,
    _Arr.unique,
    _Fn.debug,
    _Fn.tap(print(input.map)),
    _Arr.length,
  );
}

function findAntinode([[ax, ay], [bx, by]]: [Node, Node]) {
  const [dy, dx] = [by - ay, bx - ax];
  return [bx + dx, by + dy] as Node;
}

function findAllAntinodes([[ax, ay], [bx, by]]: [Node, Node]) {
  const [dy, dx] = [by - ay, bx - ax];

  return pipe(
    _Arr.range(0, 100),
    _Arr.flatMap((i) => [i, -i]),
    _Arr.map((i) => [ax + i * dx, ay + i * dy] as Node),
  );
}

function isOutOfBounds(map: string[]) {
  return ([x, y]: Node) =>
    x < 0 || y < 0 || x >= map[0].length || y >= map.length;
}

function print(map: string[]) {
  return (nodes: Node[]) => {
    const clone = map.map(_Str.chars);
    nodes.forEach(([x, y]) => {
      clone[y][x] = clone[y][x] === "." ? "#" : clone[y][x];
    });

    console.log(clone.map((row) => row.join("")).join("\n"));
  };
}
