import { pipe } from "../utils/pipeline/_pipe.ts";
import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Bool } from "../utils/pipeline/_Bool.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";

type Pair = [number, number];
type Line = [Pair, Pair, Pair];
type Parsed = Line[];
type Parser = (raw: string) => Parsed;

export const parse: Parser = pipeline(
  _Str.paragraphs,
  _Arr.map(
    pipeline(
      _Str.match(
        /Button A: X\+(\d+), Y\+(\d+)\sButton B: X\+(\d+), Y\+(\d+)\sPrize: X=(\d+), Y=(\d+)/,
      ),
      (match) => _Arr.from(match ?? []),
      _Arr.drop(1),
      _Arr.map(Number),
      _Arr.pairs,
    ),
  ),
  (res) => res as Parsed,
);

export function part1(input: Parsed) {
  return pipe(
    input,
    _Arr.map(doo),
    _Arr.mapNested(_Num.sumAll),
    _Arr.filter(_Bool.invert(_Arr.isEmpty)),
    _Arr.map(_Num.min),
    _Num.sumAll,
  );
}

function doo([buttonA, buttonB, prize]: Line) {
  const pointA = buttonB;
  const pointB = [prize[0] - buttonA[0], prize[1] - buttonA[1]] as Pair;

  const slopeOriginPointA = pointA[1] / pointA[0];
  const slopePrizePointB = pointB[1] / pointB[0];

  const pointWhereSlopeOriginPointACrossesSlopePrizePointB = [
    (pointA[1] - pointB[1]) / (slopePrizePointB - slopeOriginPointA),
    (pointA[1] - pointB[1]) / (slopePrizePointB - slopeOriginPointA) *
    slopeOriginPointA,
  ];

  const test = [buttonB[0] * 40, buttonB[1] * 40] as Pair;
  const test2 = [buttonA[0] * 80, buttonA[1] * 80];

  console.log(
    slopeOriginPointA,
    slopePrizePointB,
    pointWhereSlopeOriginPointACrossesSlopePrizePointB,
    test,
    test2,
  );

  return [];

  // const row = build([0, 0], buttonA, prize);
  //
  // const options = [] as Pair[];
  // for (let r = 0; r < row.length; r++) {
  //   const col = build(row[r], buttonB, prize);
  //   const c = col.findIndex((other) => Tuple.areEqual(other, prize));
  //
  //   if (c !== -1) options.push([r * 3, c]);
  // }
  //
  // return options;
}

function build(origin: Pair, [dx, dy]: Pair, [px, py]: Pair) {
  const row = [origin];

  for (let i = 0; i < 100; i++) {
    const [x, y] = row[i];
    const sample = [x + dx, y + dy] as Pair;
    if (sample[0] > px || sample[1] > py) break;
    row.push(sample);
  }

  return row;
}

export function part2(input: Parsed) {
  return input;
}
