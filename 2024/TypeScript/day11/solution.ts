import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { Node, Resolver } from "./node.ts";

type Parsed = number[];
type Parser = (raw: string) => Parsed;

export const parse: Parser = pipeline(Str.words, Arr.map(Number));

const solve = (times: number) => {
  const resolver = new Resolver();
  return pipeline(
    Arr.map((n: number) => new Node(n, resolver)),
    Arr.map((node) => node.countToDepth(times)),
    Num.sumAll,
  );
};

export const part1 = solve(25);

export const part2 = solve(75);
