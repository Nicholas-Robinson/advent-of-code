import { pipe } from "../utils/pipeline/_pipe.ts";
import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Arr } from "../utils/pipeline/_Arr.ts";
import { _Fn } from "../utils/pipeline/_Fn.ts";
import { _Num } from "../utils/pipeline/_Num.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import { Plot } from "./plot.ts";

type Garden = Plot[][];
type Parser = (input: string) => Garden;
type Solution = (input: Garden) => number;

export const parse: Parser = pipeline(
  _Str.lines,
  _Arr.map(_Str.chars),
  _Arr.mapNested(Plot.initialise),
);

export const part1: Solution = (garden: Garden) =>
  pipe(
    garden,
    getPlots,
    _Arr.mapNested(Plot.getParameterDetails(garden)),
    _Arr.map(_Arr.unzip),
    _Arr.mapNested(_Num.sumAll),
    _Arr.map(_Num.multiplyAll),
    _Num.sumAll,
  );

export const part2 = (garden: Garden) =>
  pipe(
    garden,
    getPlots,
    _Arr.map((plots) =>
      [
        plots.filter((plot) => plot.hasNorthernBoundary(garden)),
        plots.filter((plot) => plot.hasSouthernBoundary(garden)),
        plots.filter((plot) => plot.hasEasternBoundary(garden)),
        plots.filter((plot) => plot.hasWesternBoundary(garden)),
        plots.map((plot) => plot.area()),
      ] as [Plot[], Plot[], Plot[], Plot[], number[]]
    ),
    _Arr.mapN(
      getDistinctFences("horizontal"),
      getDistinctFences("horizontal"),
      getDistinctFences("vertical"),
      getDistinctFences("vertical"),
      _Arr.map(_Fn.identity),
    ),
    _Arr.mapN(
      _Arr.length,
      _Arr.length,
      _Arr.length,
      _Arr.length,
      _Num.sumAll,
    ),
    _Arr.map((details) => [
      pipe(details, _Arr.take(4), _Num.sumAll),
      _Arr.last(details),
    ]),
    _Arr.map(_Num.multiplyAll),
    _Num.sumAll,
  );

function getPlots(garden: Garden) {
  const plots: Plot[][] = [];
  const included = new Set<Plot>();

  for (const line of garden) {
    for (const plot of line) {
      if (included.has(plot)) continue;
      plots.push(plot.getWholePlot(garden, included));
    }
  }

  return plots;
}

const getDistinctFences = (direction: Direction) => (borders: Plot[]) => {
  const fenceRun: Plot[] = [];
  const fences: Plot[][] = [];

  const [primaryCoord, offCoord] = getDirectionResolvers(direction);

  const plots = borders
    .toSorted((a, b) => primaryCoord(a) - primaryCoord(b))
    .toSorted((a, b) => offCoord(a) - offCoord(b));

  for (const plot of plots) {
    if (isTheSameFenceSegment(direction, plot, _Arr.last(fenceRun))) {
      fenceRun.push(plot);
      continue;
    }

    fences.push(fenceRun.slice());
    fenceRun.length = 0;
    fenceRun.push(plot);
  }

  fences.push(fenceRun.slice());
  return fences;
};

const xLocation = (p: Plot) => p.location.x;
const yLocation = (p: Plot) => p.location.y;

type Direction = "horizontal" | "vertical";

const getDirectionResolvers = (direction: Direction) =>
  direction === "horizontal" ? [xLocation, yLocation] : [yLocation, xLocation];

const isTheSameFenceSegment = (
  direction: Direction,
  plot: Plot,
  other?: Plot,
) => {
  const [primaryCoord, offCoord] = getDirectionResolvers(direction);
  return other !== undefined &&
    primaryCoord(plot) === primaryCoord(other) + 1 &&
    offCoord(plot) === offCoord(other);
};
