import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Bool } from "../utils/pipeline/Bool.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Obj } from "../utils/pipeline/Obj.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { Tuple } from "../utils/pipeline/Tuple.ts";

type Parsed = { rules: [number, number][]; updates: number[][] };

const parseRules = pipeline(
  Arr.map(Str.bisect("|")),
  Arr.map(Tuple.mapBoth(Number, Number)),
);

const parseUpdates = pipeline(
  Arr.map(Str.split(",")),
  Arr.mapNested(Number),
);

export const parse = pipeline(
  Str.bisect("\n\n"),
  Tuple.mapBoth(Str.lines, Str.lines),
  Tuple.mapBoth(parseRules, parseUpdates),
  Tuple.toNamedRecord("rules", "updates"),
);

const buildRulesLookup = pipeline(
  Arr.groupBy(Tuple.first<number, number>),
  Obj.mapValues(Arr.map(Tuple.second)),
);

export function part1({ rules, updates }: Parsed) {
  const rulesLookup = buildRulesLookup(rules);

  return pipe(
    updates,
    Arr.filter(filterByRules(rulesLookup)),
    Arr.map((arr) => arr[Math.floor(arr.length / 2)]),
    Num.sumAll,
  );
}

export function part2({ rules, updates }: Parsed) {
  const rulesLookup = buildRulesLookup(rules);

  return pipe(
    updates,
    Arr.filter(Bool.invert(filterByRules(rulesLookup))),
    Arr.map(Arr.sort(sortByRules(rulesLookup))),
    Arr.map((arr) => arr[Math.floor(arr.length / 2)]),
    Num.sumAll,
  );
}

function filterByRules(rulesLookup: Record<number, number[]>) {
  return (pages: number[]) => {
    const passed = new Set<number>();

    for (const page of pages) {
      passed.add(page);

      const rule = rulesLookup[page];
      if (rule?.some((r) => passed.has(r))) {
        return false;
      }
    }

    return true;
  };
}

function sortByRules(rulesLookup: Record<number, number[]>) {
  return (a: number, b: number) => {
    if (rulesLookup[a]?.includes(b)) return -1;
    if (rulesLookup[b]?.includes(a)) return 1;
    return 0;
  };
}
