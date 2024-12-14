import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Set } from "../utils/pipeline/_Set.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { FixNode } from "./fixNode.ts";

type Parsed = FixNode[];
type Parser = (input: string) => Parsed;
type Solution = (input: Parsed) => number;

export const parse: Parser = pipeline(
  // Parse input
  _Str.lines,
  _Arr.map(_Str.chars),
  _Arr.mapNested(Number),
  // Create and populate the map
  _Arr.mapNested(FixNode.create),
  _Fn.tap((map) => {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const node = map[y][x];
        node.addNext(map[y - 1]?.[x]);
        node.addNext(map[y + 1]?.[x]);
        node.addNext(map[y][x - 1]);
        node.addNext(map[y][x + 1]);
      }
    }
  }),
  // Find all trail heads
  _Arr.filterNested(FixNode.isTrailHead),
  _Arr.flatten,
);

export const part1: Solution = pipeline(
  _Arr.map((node) => node.findEnds([], [])),
  _Arr.map(pipeline(_Set.from, _Set.size)),
  _Num.sumAll,
);

export const part2: Solution = pipeline(
  _Arr.map((node) => node.findEnds([], [])),
  _Arr.map(_Arr.length),
  _Num.sumAll,
);
