import { Cpu } from "./Cpu.ts";
import type { Program } from "./Program.ts";

export class CpuTestPlatform {
  constructor(
    private readonly cpu: Cpu,
    private readonly program: Program,
  ) {}

  findInitialARegisterValue() {
    let startingARegisterBin = this.program.instructions.map((instruction) =>
      instruction.toString(2).padStart(3, "0")
    );
    startingARegisterBin.pop();
    startingARegisterBin = startingARegisterBin.reverse();
    startingARegisterBin.push("000");

    const initialARegisterValue = parseInt(startingARegisterBin.join(""), 2);
    const initialBRegisterValue = this.cpu.bRegister;
    const initialCRegisterValue = this.cpu.cRegister;

    const expected = this.program.instructions.join();

    console.log("Initial A register value:", initialARegisterValue);

    for (let a = initialARegisterValue; a < initialARegisterValue + 8; a++) {
      this.cpu.reset(a, initialBRegisterValue, initialCRegisterValue);
      this.program.restart();

      // this.cpu.runProgram(this.program);
      // console.log(this.cpu.flush(), '||',  this.program.instructions.join());

      while (!this.program.isHalted) {
        this.cpu.tickProgram(this.program);
        const current = this.cpu.flush();
        if (current.length && !expected.startsWith(current)) break;
      }

      console.log('run', a, this.cpu.flush(), expected)

      // for (let i = 0; i < 10; i++) {
      // console.log(this.cpu.flush(), '||',  this.program.instructions.join());
      //   this.cpu.tickProgram(this.program)
      // }

      // console.log("--------------------");


      if (this.cpu.flush() === this.program.instructions.join()) {
        return a;
      }
    }
  }
}
