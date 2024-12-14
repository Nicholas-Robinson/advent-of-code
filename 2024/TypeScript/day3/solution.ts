import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { _Tuple } from "../utils/pipeline/_Tuple.ts";

export const parse = _Fn.identity;

export const part1 = pipeline(
  _Str.match(/(mul\(\d+,\d+\))/g),
  _Fn.orDefault([] as string[]),
  // Parse the instructions
  _Arr.map(_Str.drop(4)),
  _Arr.map(_Str.dropEnd(1)),
  _Arr.map(_Str.split(",")),
  _Arr.mapNested(Number),
  // Calculate the result
  _Arr.map(_Num.multiplyAll),
  _Num.sumAll,
);

export const part2 = pipeline(
  _Str.split("do()"),
  _Arr.map(_Str.bisect("don't()")),
  _Arr.map(_Tuple.first),
  _Arr.map(part1),
  _Num.sumAll,
);
