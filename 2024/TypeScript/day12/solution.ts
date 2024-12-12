import { pipe } from "../utils/pipeline/_pipe.ts";
import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Fn } from "../utils/pipeline/Fn.ts";
import { Num } from "../utils/pipeline/Num.ts";
import { Str } from "../utils/pipeline/Str.ts";
import { Plot } from "./plot.ts";

type Garden = Plot[][];
type Parser = (input: string) => Garden;
type Solution = (input: Garden) => number;

export const parse: Parser = pipeline(
  Str.lines,
  Arr.map(Str.chars),
  Arr.mapNested(Plot.initialise),
);

export const part1: Solution = (garden: Garden) =>
  pipe(
    garden,
    getPlots,
    Arr.mapNested(Plot.getParameterDetails(garden)),
    Arr.map(Arr.unzip),
    Arr.mapNested(Num.sumAll),
    Arr.map(Num.multiplyAll),
    Num.sumAll,
  );

export const part2 = (garden: Garden) =>
  pipe(
    garden,
    getPlots,
    Arr.map((plots) =>
      [
        plots.filter((plot) => plot.hasNorthernBoundary(garden)),
        plots.filter((plot) => plot.hasSouthernBoundary(garden)),
        plots.filter((plot) => plot.hasEasternBoundary(garden)),
        plots.filter((plot) => plot.hasWesternBoundary(garden)),
        plots.map((plot) => plot.area()),
      ] as [Plot[], Plot[], Plot[], Plot[], number[]]
    ),
    Arr.mapN(
      getDistinctFences("horizontal"),
      getDistinctFences("horizontal"),
      getDistinctFences("vertical"),
      getDistinctFences("vertical"),
      Arr.map(Fn.identity),
    ),
    Arr.mapN(
      Arr.length,
      Arr.length,
      Arr.length,
      Arr.length,
      Num.sumAll,
    ),
    Arr.map((details) => [
      pipe(details, Arr.take(4), Num.sumAll),
      Arr.last(details),
    ]),
    Arr.map(Num.multiplyAll),
    Num.sumAll,
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
    if (isTheSameFenceSegment(direction, plot, Arr.last(fenceRun))) {
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
