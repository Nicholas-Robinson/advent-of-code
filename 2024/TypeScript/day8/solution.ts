import { pipe } from "../utils/pipeline/_pipe.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Bool } from "../utils/pipeline/Bool.ts";
import { Fn } from "../utils/pipeline/Fn.ts";
import { Obj } from "../utils/pipeline/Obj.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { Tuple } from "../utils/pipeline/Tuple.ts";

type Node = [x: number, y: number];
type Parsed = { map: string[]; nodes: Record<string, Node[]> };

export function parse(raw: string): Parsed {
  const map = Str.lines(raw);

  const nodes = pipe(
    map,
    Arr.map(Str.chars),
    Arr.mapNested((char, x, y) => [char, [x, y]] as [string, Node]),
    Arr.flatten,
    Arr.filter(([char]) => char !== "."),
    Arr.groupBy(Tuple.first),
    Obj.mapValues(Arr.map(Tuple.second)),
  );

  return { map, nodes };
}

export function part1(input: Parsed) {
  return pipe(
    input.nodes,
    Obj.mapValues(Arr.combinationPairs),
    Obj.mapValues(Arr.map((pair) => [
      findAntinode(pair),
      findAntinode(Tuple.swap(pair)),
    ])),
    Obj.values,
    Arr.flatMapNested(Fn.identity),
    Arr.filter(Bool.invert(isOutOfBounds(input.map))),
    Arr.unique,
    Fn.tap(print(input.map)),
    Arr.length,
  );
}

export function part2(input: Parsed) {
  return pipe(
    input.nodes,
    Obj.mapValues(Arr.combinationPairs),
    Obj.mapValues(Arr.map(findAllAntinodes)),
    Obj.values,
    Arr.flatMapNested(Fn.identity),
    Arr.filter(Bool.invert(isOutOfBounds(input.map))),
    Fn.debug,
    Arr.unique,
    Fn.debug,
    Fn.tap(print(input.map)),
    Arr.length,
  );
}

function findAntinode([[ax, ay], [bx, by]]: [Node, Node]) {
  const [dy, dx] = [by - ay, bx - ax];
  return [bx + dx, by + dy] as Node;
}

function findAllAntinodes([[ax, ay], [bx, by]]: [Node, Node]) {
  const [dy, dx] = [by - ay, bx - ax];

  return pipe(
    Arr.range(0, 100),
    Arr.flatMap((i) => [i, -i]),
    Arr.map((i) => [ax + i * dx, ay + i * dy] as Node),
  );
}

function isOutOfBounds(map: string[]) {
  return ([x, y]: Node) =>
    x < 0 || y < 0 || x >= map[0].length || y >= map.length;
}

function print(map: string[]) {
  return (nodes: Node[]) => {
    const clone = map.map(Str.chars);
    nodes.forEach(([x, y]) => {
      clone[y][x] = clone[y][x] === "." ? "#" : clone[y][x];
    });

    console.log(clone.map((row) => row.join("")).join("\n"));
  };
}
