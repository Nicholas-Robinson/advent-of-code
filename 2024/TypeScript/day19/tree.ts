import { _Arr } from "../utils/pipeline/_Arr.ts"
import { pipe } from "../utils/pipeline/_pipe.ts"

export class TowelTree {
  static from(towels: string[][]) {
    const parsedTowels = pipe(towels, _Arr.map(TowelStripe.from));
    return new TowelTree(parsedTowels, parsedTowels.slice());
  }

  private constructor(
    private readonly towels: TowelStripe[],
    private readonly allTowels: TowelStripe[],
  ) {}

  get listOfTowelPatters() {
    return pipe(this.towels, _Arr.map((towel) => towel.pattern));
  }

  get isEmpty() {
    return this.towels.length === 0;
  }

  nextForColour(colour: string) {
    if (this.isEmpty) return this;

    const next = pipe(
      this.towels,
      _Arr.filter((towel) => towel.is(colour)),
      _Arr.flatMap((towel) => towel.next ? [towel.next] : this.allTowels),
    );

    return new TowelTree(next, this.allTowels);
  }
}

class TowelStripe {
  static from(pattern: string[]) {
    return new TowelStripe(pattern);
  }

  readonly next: TowelStripe | null = null;
  private readonly colour: string;

  constructor([first, ...rest]: string[]) {
    this.colour = first as string;
    if (rest.length) this.next = new TowelStripe(rest);
  }

  get pattern(): string {
    return this.colour + (this.next?.pattern ?? "");
  }

  is(colour: string) {
    return this.colour === colour;
  }
}

export class Node {
  static from(towels: string[][]) {
    const head = new Node();
    for (const towel of towels) {
      head.add(towel, head);
    }
    return head;
  }

  loopBack: Node | null = null;
  next: Record<string, Node> = {};

  add([first, ...rest]: string[], head: Node): Node {
    if (!first) {
      this.loopBack = head;
      return this;
    }

    if (!this.next[first]) {
      this.next[first] = new Node();
    }

    this.next[first].add(rest, head);
    return this;
  }

  has(colour: string): boolean {
    return colour in this.next || this.loopBack?.has(colour) === true;
  }

  get(colour: string): Node | undefined {
    return this.next[colour] ?? this.loopBack?.get(colour);
  }

  canCreatePattern([colour, ...rest]: string[]): boolean {
    if (!this.has(colour)) return false;
    if (_Arr.isEmpty(rest)) return this.loopBack !== null;

    const next = this.get(colour);
    if (!next) throw "WAT?!"

    return next.canCreatePattern(rest)
  }
}
