import { Arr } from "../utils/pipeline/Arr.ts"
import { Fn } from "../utils/pipeline/Fn.ts"
import { Num } from "../utils/pipeline/Num.ts"
import { pipeline } from "../utils/pipeline/seededPipeline.ts"
import { Str } from "../utils/pipeline/Str.ts"
import { Tuple } from "../utils/pipeline/Tuple.ts"

export const parse = Fn.identity;

export const part1 = pipeline(
  Str.match(/(mul\(\d+,\d+\))/g),
  Fn.orDefault([] as string[]),
  // Parse the instructions
  Arr.map(Str.drop(4)),
  Arr.map(Str.dropEnd(1)),
  Arr.map(Str.split(",")),
  Arr.mapNested(Number),
  // Calculate the result
  Arr.map(Num.multiplyAll),
  Num.sumAll,
);

export const part2 = pipeline(
  Str.split("do()"),
  Arr.map(Str.bisect("don't()")),
  Arr.map(Tuple.first),
  Arr.map(part1),
  Num.sumAll,
);
