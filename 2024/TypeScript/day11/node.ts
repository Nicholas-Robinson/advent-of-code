export class Resolver {
  registry: Node[] = [];
  answer: number[][] = [];

  getNextNode(value: number) {
    if (this.registry[value] === undefined) {
      this.registry[value] = new Node(value, this);
    }
    return this.registry[value];
  }
}

export class Node {
  constructor(
    public value: number,
    private readonly resolver: Resolver,
  ) {}

  next() {
    if (this.value === 0) return [this.resolver.getNextNode(1)];

    const strValue = this.value.toString();
    if (strValue.length % 2 === 0) {
      const left = strValue.slice(0, strValue.length / 2);
      const right = strValue.slice(strValue.length / 2);
      return [
        this.resolver.getNextNode(Number(left)),
        this.resolver.getNextNode(Number(right)),
      ];
    }

    return [this.resolver.getNextNode(this.value * 2024)];
  }

  countToDepth(
    targetDepth: number,
    currentDepth: number = 0,
  ): number {
    if (currentDepth === targetDepth) return 1;

    const next = this.next();
    let total = 0;

    for (const node of next) {
      if (this.resolver.answer[currentDepth] === undefined) {
        this.resolver.answer[currentDepth] = [];
      }

      if (this.resolver.answer[currentDepth][node.value] === undefined) {
        this.resolver.answer[currentDepth][node.value] = node.countToDepth(
          targetDepth,
          currentDepth + 1,
        );
      }

      total += this.resolver.answer[currentDepth][node.value];
    }

    return total;
  }
}
