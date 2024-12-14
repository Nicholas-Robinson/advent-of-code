import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";

type Segment = [fileId: number, space: number];
type Parsed = string[];

export function parse(raw: string): Parsed {
  return pipe(
    raw,
    _Str.chars,
    _Arr.map(Number),
    toPairs,
    _Arr.flatMap(toFileBlock),
    _Arr.flatten,
    _Arr.map(String),
  );
}

export function part1(input: Parsed) {
  const disk = input.slice();
  const fileBlocks = input.filter((block) => block !== ".");
  const fileBlocksLength = fileBlocks.length;

  const nextRead = (segment: string) =>
    segment !== "." ? segment : (fileBlocks.pop() ?? ".");

  return pipe(
    // De-fragment,
    disk,
    _Arr.map(nextRead),
    _Arr.take(fileBlocksLength),
    // Checksum
    _Arr.map(Number),
    _Arr.pairWithIndex,
    _Arr.map(_Num.multiplyAll),
    _Num.sumAll,
  );
}

export function part2(input: Parsed) {
  const chunks = pipe(input, _Arr.clone, categoriseMemory);
  const fileChunks = pipe(
    chunks,
    _Arr.filter(isFileChunk),
    _Arr.reverse,
  );

  for (const fileChunk of fileChunks) {
    const spaceIndex = chunks.findIndex((chunk) =>
      chunk[0] === "space" && chunk[2] >= fileChunk[2]
    );
    const i = chunks.findIndex((chunk) => chunk === fileChunk);
    if (spaceIndex === -1 || i === -1 || spaceIndex > i) continue;

    breakFreeMemberChunk(chunks, spaceIndex, fileChunk[2]);
    // Add one as we have just bisected the space chunk which added one to the size
    swapMemory(chunks, i + 1, spaceIndex);
  }

  return pipe(
    chunks,
    uncatagoriseMemory,
    _Arr.flatten,
    _Arr.map((c) => c === "." ? "0" : c),
    // Checksum
    _Arr.map(Number),
    _Arr.pairWithIndex,
    _Arr.map(_Num.multiplyAll),
    _Num.sumAll,
  );
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

type Chunk = ["file" | "space", string, number];
function categoriseMemory(memory: string[]) {
  const chunks = [] as Chunk[];
  const memoryClone = memory.slice();

  while (memoryClone.length) {
    const slot = memoryClone.shift() as string;
    if (_Arr.last(chunks)?.[1] === slot) _Arr.last(chunks)[2]++;
    else chunks.push([slot === "." ? "space" : "file", slot, 1]);
  }

  return chunks;
}

function uncatagoriseMemory(chunks: Chunk[]) {
  return chunks.map(([_, char, size]) => Array(size).fill(char));
}

function isFileChunk(chunk: Chunk): chunk is ["file", string, number] {
  return chunk[0] === "file";
}

function swapMemory(memory: Chunk[], from: number, to: number) {
  const fromChunk = memory[from];
  memory[from] = memory[to];
  memory[to] = fromChunk;
}

function breakFreeMemberChunk(
  memory: Chunk[],
  index: number,
  usedSize: number,
) {
  const chunk = memory[index];
  const [type, char, size] = chunk;
  const chunkToBeUsed = [type, char, usedSize] as Chunk;
  const remainingFreeSpace = [type, char, size - usedSize] as Chunk;
  memory.splice(index, 1, chunkToBeUsed, remainingFreeSpace);
}
