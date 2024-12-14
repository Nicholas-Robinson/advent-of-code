import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { Node, Resolver } from "./node.ts";

type Parsed = number[];
type Parser = (raw: string) => Parsed;

export const parse: Parser = pipeline(_Str.words, _Arr.map(Number));

const solve = (times: number) => {
  const resolver = new Resolver();
  return pipeline(
    _Arr.map((n: number) => new Node(n, resolver)),
    _Arr.map((node) => node.countToDepth(times)),
    _Num.sumAll,
  );
};

export const part1 = solve(25);

export const part2 = solve(75);
