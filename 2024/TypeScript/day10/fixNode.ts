export class FixNode {
  static create(elevation: number, x: number, y: number) {
    return new FixNode(elevation, [x, y]);
  }

  static isTrailHead(node: FixNode) {
    return node.isTrailHead();
  }

  constructor(
    readonly elevation: number,
    readonly location: [number, number],
    readonly next: FixNode[] = [],
  ) {}

  isTrailEnd() {
    return this.elevation === 9;
  }

  isTrailHead() {
    return this.elevation === 0;
  }

  addNext(node: FixNode | undefined) {
    if (node && node !== this && node.elevation - this.elevation === 1) {
      this.next.push(node);
    }
  }

  findEnds(path: FixNode[], reachedEnds: FixNode[]): FixNode[] {
    // Walked in a loop
    if (path.includes(this)) return reachedEnds;

    const pathClone = path.slice();
    pathClone.push(this);

    // FOUND ONE!
    if (this.isTrailEnd()) {
      reachedEnds.push(this);
      return reachedEnds;
    }

    return this.next.reduce(
      (ends, node) => node.findEnds(pathClone, ends),
      reachedEnds,
    );
  }
}
