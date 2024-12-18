import { _Arr } from "../utils/pipeline/_Arr.ts"
import { pipe } from "../utils/pipeline/_pipe.ts"
import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { _Str } from "../utils/pipeline/_Str.ts"
import { _Tuple, Tuple } from "../utils/pipeline/_Tuple.ts"

type Parsed = [
  info: [width: number, height: number, droppedBytes: number],
  coords: Tuple<number>[],
];

const parseNumbers = pipeline(_Str.split(","), _Arr.map(Number));

export function parse(raw: string): Parsed {
  const [rawInfo, ...rawCoords] = pipe(raw, _Str.lines);

  const info = pipe(rawInfo, parseNumbers) as [number, number, number];
  const coords = pipe(rawCoords, _Arr.map(parseNumbers), _Arr.map(_Tuple.lift));

  return _Tuple.from(info, coords);
}

export function part1([[width, height, dropCnt], coords]: Parsed) {
  const map: (null | number)[][] = Array.from(
    { length: height },
    () => Array(width).fill(Infinity),
  );
  const bytesToDrop = pipe(coords, _Arr.take(dropCnt));

  for (const [x, y] of bytesToDrop) {
    map[y][x] = null;
  }


  // const print = map.map((row) => row.map((cell) => (cell === null ? "#" : '.')).join(" ")).join("\n");
  //   console.log(print);

  const toProcess = new Tree([width, height]);
  toProcess.push(_Tuple.from(0, 0), 0);
  // const toProcess: [Tuple<number>, number][] = [[_Tuple.from(0, 0), 0]];
  let cnt = 0;
  const order = [];

  while (!toProcess.empty) {
    const node = toProcess.pop();
    order.push(node.coords);
    const current = map[node.y]?.[node.x];

    if (!current) continue;
    if (current < node.cost) continue;

    map[node.y][node.x] = node.cost;
    if (node.x === width - 1 && node.y === height - 1) break;

    const down = _Tuple.from(node.x + 1, node.y);
    if (map[down[1]]?.[down[0]]) toProcess.push(down, node.cost + 1);

    const up = _Tuple.from(node.x - 1, node.y);
    if (map[up[1]]?.[up[0]]) toProcess.push(up, node.cost + 1);

    const right = _Tuple.from(node.x, node.y + 1);
    if (map[right[1]]?.[right[0]]) toProcess.push(right, node.cost + 1);

    const left = _Tuple.from(node.x, node.y - 1);
    if (map[left[1]]?.[left[0]]) toProcess.push(left, node.cost + 1);
  }

  const print = map.map((row) =>
    row.map((cell) =>
      (cell === null ? "#" : (cell === Infinity ? "." : '0'))
        .padStart(2, " ").padEnd(2, " ")
    ).join(" ")
  ).join("\n");
  console.log(print);

  return map[height - 1][width - 1];
}

export function part2(input: Parsed) {
  return input;
}

class Tree {
  constructor(
    private details: Tuple<number>,
    private head: OrderedNode | null = null,
  ) {}

  get empty() {
    return !this.head;
  }

  push(pair: Tuple<number>, cost: number) {
    const node = new OrderedNode(pair, cost);

    if (!this.head) {
      this.head = node;
      return;
    }

    let pointer = this.head as OrderedNode | null;
    let prev = null as OrderedNode | null;
    while (pointer) {
      if (!pointer.isCloserToEnd(node, this.details)) {
        node.next = pointer;

        if (prev) prev.next = node;
        else this.head = node;

        break;
      }

      if (!pointer.next) {
        pointer.next = node;
        break;
      }

      prev = pointer;
      pointer = pointer.next;
    }
  }

  pop() {
    if (!this.head) throw new Error("Tree is empty");

    const result = this.head;
    this.head = this.head.next;

    return result;
  }
}

class OrderedNode {
  constructor(
    readonly coords: Tuple<number>,
    readonly cost: number,
  ) {}

  next: OrderedNode | null = null;

  get x() {
    return this.coords[0];
  }

  get y() {
    return this.coords[1];
  }

  isCloserToEnd(other: OrderedNode, [width, height]: Tuple<number>) {
    const offset = this.x - this.y;
    const otherOffset = other.x - other.y;

    const distance = (width - this.x) + (height - this.y);
    const otherDistance = (width - other.x) + (height - other.y);

    return distance + offset < otherDistance + otherOffset;
  }
}
