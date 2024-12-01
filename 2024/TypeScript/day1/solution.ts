import { sumOf, unzip, zip } from "@std/collections";
import { differenceTuple, multiplyTuple, subtract } from "../utils/calc.ts";
import { countBy } from "../utils/countBy.ts";
import { identity } from "../utils/identity.ts";
import { mapN } from "../utils/mapN.ts";
import { pairWith } from "../utils/pairWith.ts";

type Parsed = [number[], number[]];

export function parse(raw: string): Parsed {
  const columns = raw
    .split("\n")
    .map((line) => line.split(/\s+/) as [string, string]);

  return unzip(mapN(columns, Number, Number));
}

export function part1([left, right]: Parsed) {
  const pairs = zip(sortAscending(left), sortAscending(right));
  const differences = pairs.map(differenceTuple);

  return sumOf(differences, identity);
}

export function part2([left, right]: Parsed) {
  const counts = countBy(right, identity);
  const pairs = pairWith(left, (value) => counts[value] ?? 0);
  const products = pairs.map(multiplyTuple);

  return sumOf(products, identity);
}

function sortAscending(list: number[]) {
  return list.sort(subtract);
}
