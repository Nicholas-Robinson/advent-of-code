import { _Arr } from "../utils/pipeline/_Arr.ts"
import { pipe } from "../utils/pipeline/_pipe.ts"
import { pipeline } from "../utils/pipeline/_pipeline.ts"
import { _Str } from "../utils/pipeline/_Str.ts"
import type { Tuple } from "../utils/pipeline/_Tuple.ts"
import { _Tuple } from "../utils/pipeline/_Tuple.ts"

type Parsed = Tuple<string[], string[]>;
type Parser = (raw: string) => Parsed;

export const parse: Parser = pipeline(
  _Str.bisect("\n\n"),
  _Tuple.mapBoth(_Str.split(", "), _Str.lines),
);

export function part1([towels, patterns]: Parsed) {
  return pipe(
    patterns,
    _Arr.map((pattern) => canMakePattern(pattern, towels)),
    _Arr.filter(Boolean),
    _Arr.length,
  );

  // const node = Node.from(towels);
  //
  // return pipe(
  //   patterns,
  //   _Arr.map((pattern) => node.canCreatePattern(pattern)),
  //   _Arr.filter(Boolean),
  //   _Arr.length,
  // );

  // return pipe(
  //   patterns,
  //   _Arr.map(
  //     _Arr.reduce(
  //       (tree, colour) => tree.nextForColour(colour),
  //       TowelTree.from(towels),
  //     ),
  //   ),
  //   _Arr.filter((tree) => !tree.isEmpty),
  //   _Arr.length,
  // );
}

export function part2([towels, patterns]: Parsed) {
  return pipe(
      patterns,
      _Arr.map((pattern) => countAllVariants(pattern, towels)),
      // _Arr.filter(Boolean),
      // _Arr.length,
  );
}

function canMakePattern(pattern: string, towels: string[]) {
  const branches = [pattern];
  const seen: Record<string, string[]> = {};

  while (branches.length) {
    const branch = branches.pop()!;

    if (branch in seen) {
      continue;
    }

    if (branch === "") {
      return true;
    }

    const next = pipe(
      towels,
      _Arr.filter((towel) => branch.startsWith(towel)),
      _Arr.map((towel) => branch.slice(towel.length)),
    );

    branches.push(...next);
    seen[branch] = next;
  }

  return false;
}


function countAllVariants(pattern: string, towels: string[]) {
  const branches = [pattern];
  const towelsShortList = towels.filter(towel => pattern.includes(towel));
  const seen: Record<string, string[]> = {};
  let cnt = 0;

  while (branches.length) {
    const branch = branches.pop()!;

    if (branch === "") {
       cnt++;
       continue;
    }

    // if (branch in seen) {
    //   continue;
    // }

    const next = pipe(
      towels,
      _Arr.filter((towel) => branch.startsWith(towel)),
      _Arr.map((towel) => branch.slice(towel.length)),
    );

    branches.push(...next);
    seen[branch] = next;
  }

  console.log(pattern, cnt);

  return cnt;
}
