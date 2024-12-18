import { pipe } from "../utils/pipeline/_pipe.ts"
import { _Str } from "../utils/pipeline/_Str.ts"
import { Program } from "./Program.ts"

type Opcode = 0;
type Operand = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export class Cpu {
  private stdOut: string = "";

  constructor(
    private a: number,
    private b: number,
    private c: number,
  ) {}

  get bRegister() {
    return this.b;
  }

  get cRegister() {
    return this.c;
  }

  runProgram(program: Program) {
    while (!program.isHalted) {
      this.tick(program);
    }
  }

  tickProgram(program: Program) {
    if (!program.isHalted) {
      this.tick(program);
    }
  }

  flush() {
    return pipe(this.stdOut, _Str.dropEnd(1));
  }

  reset(a: number, b: number, c: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.stdOut = "";
  }

  private adv(operand: Operand) {
    this.a >>= this.resolveOperand(operand);
  }

  private bxl(operand: Operand) {
    this.b ^= operand;
  }

  private bst(operand: Operand) {
    this.b = this.resolveOperand(operand) % 8;
  }

  private jnz(operand: Operand, program: Program) {
    if (this.a !== 0) program.setInstructionPointer(operand);
  }

  private bxc(_operand: Operand) {
    this.b ^= this.c;
  }

  private out(operand: Operand) {
    this.stdOut += (this.resolveOperand(operand) % 8).toString() + ",";
  }

  private bdv(operand: Operand) {
    this.b = this.a >> this.resolveOperand(operand);
  }

  private cdv(operand: Operand) {
    this.c = this.a >> this.resolveOperand(operand);
  }

  private tick(program: Program) {
    switch (program.nextInstruction()) {
      case 0:
        this.adv(program.nextInstruction() as Operand);
        break;

      case 1:
        this.bxl(program.nextInstruction() as Operand);
        break;

      case 2:
        this.bst(program.nextInstruction() as Operand);
        break;

      case 3:
        this.jnz(program.nextInstruction() as Operand, program);
        break;

      case 4:
        this.bxc(program.nextInstruction() as Operand);
        break;

      case 5:
        this.out(program.nextInstruction() as Operand);
        break;

      case 6:
        this.bdv(program.nextInstruction() as Operand);
        break;

      case 7:
        this.cdv(program.nextInstruction() as Operand);
        break;
    }
  }

  private resolveOperand(operand: Operand) {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;

      case 4:
        return this.a;

      case 5:
        return this.b;

      case 6:
        return this.c;

      case 7:
        throw new Error("Operand 7 is reserved");
    }
  }
}
