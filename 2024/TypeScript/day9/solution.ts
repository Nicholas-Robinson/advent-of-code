import { seededPipeline } from "../utils/pipeline/_seededPipeline.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Str } from "../utils/pipeline/Str.ts";

type Segment = [fileId: number, space: number];
type Parsed = string[];

export function parse(raw: string): Parsed {
  return seededPipeline(
    raw,
    Str.chars,
    Arr.map(Number),
    toPairs,
    Arr.flatMap(toFileBlock),
    Arr.flatten,
    Arr.map(String),
  );
}

export function part1(input: Parsed) {
  const disk = input.slice();
  const fileBlocks = input.filter((block) => block !== ".");
  const fileBlocksLength = fileBlocks.length;

  const nextRead = (segment: string) =>
    segment !== "." ? segment : (fileBlocks.pop() ?? ".");

  return seededPipeline(
    // De-fragment,
    disk,
    Arr.map(nextRead),
    Arr.take(fileBlocksLength),
    // // Checksum
    Arr.map(Number),
    Arr.pairWithIndex,
    Arr.map(Num.multiplyAll),
    Num.sumAll,
  );
}

export function part2(input: Parsed) {
  return input;
}

function toPairs(arr: number[]): Segment[] {
  const pairs = [] as Segment[];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push([arr[i], arr[i + 1] ?? 0]);
  }
  return pairs;
}

function toFileBlock(
  [fileLength, spaceLength]: Segment,
  fileId: number,
) {
  return [
    Array(fileLength).fill(fileId),
    Array(spaceLength).fill("."),
  ];
}
