import type { Tuple } from "../utils/pipeline/_Tuple.ts"
import { _Tuple } from "../utils/pipeline/_Tuple.ts"

export type Item = {
  isAtPosition(position: Tuple<number>): boolean;
};

// export function parse

abstract class SingleLocation implements Item {
  constructor(
    protected position: Tuple<number>,
  ) {}

  isAtPosition(position: Tuple<number>): boolean {
    return _Tuple.areEqual(this.position, position);
  }
}

class Floor extends SingleLocation implements Item {
}

class Wall extends SingleLocation implements Item {
}

class Box implements Item {
  constructor(
    private left: Tuple<number>,
    private right: Tuple<number>,
  ) {}

  isAtPosition(position: Tuple<number>): boolean {
    return _Tuple.areEqual(this.left, position) ||
      _Tuple.areEqual(this.right, position);
  }
}
