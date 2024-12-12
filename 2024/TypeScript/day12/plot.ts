import { pipe } from "../utils/pipeline/_pipe.ts";
import { _Set } from "../utils/pipeline/_Set.ts";
import { Arr } from "../utils/pipeline/Arr.ts";
import { Bool } from "../utils/pipeline/Bool.ts";

export class Plot {
  static initialise(value: string, x: number, y: number): Plot {
    return new Plot(value, { x, y });
  }

  static getParameterDetails(garden: Plot[][]) {
    return (plot: Plot) =>
      [plot.area(), plot.perimeter(garden)] as [number, number];
  }

  constructor(
    readonly plantType: string,
    readonly location: { x: number; y: number },
  ) {}

  isSamePlotType(other: Plot): boolean {
    return this.plantType === other.plantType;
  }

  northNeighbor(garden: Plot[][]): Plot | undefined {
    return garden[this.location.y - 1]?.[this.location.x];
  }

  southNeighbor(garden: Plot[][]): Plot | undefined {
    return garden[this.location.y + 1]?.[this.location.x];
  }

  eastNeighbor(garden: Plot[][]): Plot | undefined {
    return garden[this.location.y]?.[this.location.x + 1];
  }

  westNeighbor(garden: Plot[][]): Plot | undefined {
    return garden[this.location.y]?.[this.location.x - 1];
  }

  hasNorthernBoundary(garden: Plot[][]): boolean {
    const northNeighbor = this.northNeighbor(garden);
    return northNeighbor === undefined || !this.isSamePlotType(northNeighbor);
  }

  hasSouthernBoundary(garden: Plot[][]): boolean {
    const southNeighbor = this.southNeighbor(garden);
    return southNeighbor === undefined || !this.isSamePlotType(southNeighbor);
  }

  hasEasternBoundary(garden: Plot[][]): boolean {
    const eastNeighbor = this.eastNeighbor(garden);
    return eastNeighbor === undefined || !this.isSamePlotType(eastNeighbor);
  }

  hasWesternBoundary(garden: Plot[][]): boolean {
    const westNeighbor = this.westNeighbor(garden);
    return westNeighbor === undefined || !this.isSamePlotType(westNeighbor);
  }

  getNeighbors(garden: Plot[][]) {
    return [
      this.northNeighbor(garden),
      this.southNeighbor(garden),
      this.eastNeighbor(garden),
      this.westNeighbor(garden),
    ];
  }

  getWholePlot(garden: Plot[][], included: Set<Plot>): Plot[] {
    if (included.has(this)) return [];
    included.add(this);

    return pipe(
      this.getNeighbors(garden) as Plot[],
      Arr.filter(
        Bool.passAll([
          Bool.defined<Plot>,
          Bool.invert(_Set.has(included)),
          this.isSamePlotType.bind(this),
        ]),
      ),
      Arr.flatMap((plot) => plot.getWholePlot(garden, included)),
      Arr.append(this as Plot),
    );
  }

  area() {
    return 1;
  }

  perimeter(garden: Plot[][]) {
    return pipe(
      this.getNeighbors(garden) as Plot[],
      Arr.filter(
        Bool.passAny([
          Bool.invert(Bool.defined<Plot>),
          Bool.invert(this.isSamePlotType.bind(this)),
        ]),
      ),
      Arr.length,
    );
  }
}
