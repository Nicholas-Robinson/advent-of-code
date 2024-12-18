import { _Arr } from "../utils/pipeline/_Arr.ts";
import { pipe } from "../utils/pipeline/_pipe.ts";
import { pipeline } from "../utils/pipeline/_pipeline.ts";
import { _Str } from "../utils/pipeline/_Str.ts";
import type { Tuple } from "../utils/pipeline/_Tuple.ts";
import { _Tuple } from "../utils/pipeline/_Tuple.ts";
import { Cpu } from "./Cpu.ts";
import { CpuTestPlatform } from "./CpuTestPlatform.ts";
import { Program } from "./Program.ts";

type Parsed = Tuple<Cpu, Program>;

export function parse(raw: string): Parsed {
  const [[a, b, c], instructions] = pipe(
    raw,
    _Str.bisect("\n\n"),
    _Tuple.mapBoth(
      pipeline(
        _Str.match(/Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)/),
        _Arr.drop(1),
        _Arr.map(Number),
      ),
      pipeline(_Str.drop(9), _Str.split(","), _Arr.map(Number)),
    ),
  );

  return _Tuple.from(new Cpu(a, b, c), new Program(instructions));
}

export function part1([cpu, program]: Parsed) {
  cpu.runProgram(program);

  return cpu.flush();
}

export function part2([cpu, program]: Parsed) {
  const testBed = new CpuTestPlatform(cpu, program);

  return testBed.findInitialARegisterValue();
}