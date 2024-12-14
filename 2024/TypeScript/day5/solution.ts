import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Bool } from "../utils/pipeline/_Bool.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Obj } from "../utils/pipeline/_Obj.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { _Tuple } from "../utils/pipeline/_Tuple.ts";

type Parsed = { rules: [number, number][]; updates: number[][] };

const parseRules = pipeline(
  _Arr.map(_Str.bisect("|")),
  _Arr.map(_Tuple.mapBoth(Number, Number)),
);

const parseUpdates = pipeline(
  _Arr.map(_Str.split(",")),
  _Arr.mapNested(Number),
);

export const parse = pipeline(
  _Str.bisect("\n\n"),
  _Tuple.mapBoth(_Str.lines, _Str.lines),
  _Tuple.mapBoth(parseRules, parseUpdates),
  _Tuple.toNamedRecord("rules", "updates"),
);

const buildRulesLookup = pipeline(
  _Arr.groupBy(_Tuple.first<number, number>),
  _Obj.mapValues(_Arr.map(_Tuple.second)),
);

export function part1({ rules, updates }: Parsed) {
  const rulesLookup = buildRulesLookup(rules);

  return pipe(
    updates,
    _Arr.filter(filterByRules(rulesLookup)),
    _Arr.map((arr) => arr[Math.floor(arr.length / 2)]),
    _Num.sumAll,
  );
}

export function part2({ rules, updates }: Parsed) {
  const rulesLookup = buildRulesLookup(rules);

  return pipe(
    updates,
    _Arr.filter(_Bool.invert(filterByRules(rulesLookup))),
    _Arr.map(_Arr.sort(sortByRules(rulesLookup))),
    _Arr.map((arr) => arr[Math.floor(arr.length / 2)]),
    _Num.sumAll,
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
