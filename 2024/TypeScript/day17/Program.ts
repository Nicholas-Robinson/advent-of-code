export class Program {
  private instructionPointer: number = 0;

  constructor(
    readonly instructions: number[],
  ) {}

  get isHalted() {
    return this.instructionPointer >= this.instructions.length;
  }

  nextInstruction() {
    return this.instructions[this.instructionPointer++];
  }

  setInstructionPointer(value: number) {
    this.instructionPointer = value;
  }

  restart() {
    this.instructionPointer = 0;
  }
}
