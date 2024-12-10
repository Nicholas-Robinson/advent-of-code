import { pipe } from "../utils/pipeline/_pipe.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Str } from "../utils/pipeline/Str.ts";

type Segment = [fileId: number, space: number];
type Parsed = string[];

export function parse(raw: string): Parsed {
  return pipe(
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

  return pipe(
    // De-fragment,
    disk,
    Arr.map(nextRead),
    Arr.take(fileBlocksLength),
    // Checksum
    Arr.map(Number),
    Arr.pairWithIndex,
    Arr.map(Num.multiplyAll),
    Num.sumAll,
  );
}

export function part2(input: Parsed) {
  const chunks = pipe(input, Arr.clone, categoriseMemory);
  const fileChunks = pipe(
    chunks,
    Arr.filter(isFileChunk),
    Arr.reverse,
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
    Arr.flatten,
    Arr.map((c) => c === "." ? "0" : c),
    // Checksum
    Arr.map(Number),
    Arr.pairWithIndex,
    Arr.map(Num.multiplyAll),
    Num.sumAll,
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
    if (Arr.last(chunks)?.[1] === slot) Arr.last(chunks)[2]++;
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
