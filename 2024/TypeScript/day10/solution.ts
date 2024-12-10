import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Set } from "../utils/pipeline/_Set.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Fn } from "../utils/pipeline/Fn.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { FixNode } from "./fixNode.ts";

type Parsed = FixNode[];
type Parser = (input: string) => Parsed;
type Solution = (input: Parsed) => number;

export const parse: Parser = pipeline(
  // Parse input
  Str.lines,
  Arr.map(Str.chars),
  Arr.mapNested(Number),
  // Create and populate the map
  Arr.mapNested(FixNode.create),
  Fn.tap((map) => {
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
  Arr.filterNested(FixNode.isTrailHead),
  Arr.flatten,
);

export const part1: Solution = pipeline(
  Arr.map((node) => node.findEnds([], [])),
  Arr.map(pipeline(_Set.from, _Set.size)),
  Num.sumAll,
);

export const part2: Solution = pipeline(
  Arr.map((node) => node.findEnds([], [])),
  Arr.map(Arr.length),
  Num.sumAll,
);
