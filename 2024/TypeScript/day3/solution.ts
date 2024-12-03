import { Arr } from "../utils/pipeline/Arr.ts"
import { Fn } from "../utils/pipeline/Fn.ts"
import { Num } from "../utils/pipeline/Num.ts"
import { pipeline } from "../utils/pipeline/pipeline.ts"
import { Str } from "../utils/pipeline/Str.ts"
import { Tuple } from "../utils/pipeline/Tuple.ts"

type Parsed = string;

export function parse(raw: string): Parsed {
  return raw;
}

export function part1(input: Parsed) {
  return pipeline(
    input,
    // Get the input equations
    Str.match(/(mul\(\d+,\d+\))/g),
    Fn.orDefault([] as string[]),
    computeInstructions,
  );
}

export function part2(input: Parsed) {
  return pipeline(
    input,
    // Get the input equations
    Str.match(/(mul\(\d+,\d+\))|(don't\(\))|(do\(\))/g),
    Fn.orDefault([] as string[]),
    dropExcludedInstructions,
    computeInstructions,
  );
}

function computeInstructions(instructions: string[]) {
  return pipeline(
    instructions,
    // Parse the instructions
    Arr.map(Str.drop(4)),
    Arr.map(Str.dropEnd(1)),
    Arr.map(Str.split(",")),
    Arr.mapNested(Number),
    // Calculate the result
    Arr.map(Num.multiplyAll),
    Num.sumAll,
  );
}

function dropExcludedInstructions(instructions: string[]) {
  return pipeline(
    instructions,
    Arr.reduce(([take, result], line) => {
      if (line === "don't()") return [false, result] as [boolean, string[]];
      if (line === "do()") return [true, result] as [boolean, string[]];
      if (take) result.push(line);
      return [take, result] as [boolean, string[]];
    }, [true, []] as [boolean, string[]]),
    Tuple.second,
  );
}
