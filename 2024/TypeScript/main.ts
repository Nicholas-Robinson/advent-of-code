import { parse } from "https://deno.land/std@0.200.0/flags/mod.ts";

type Part = "1" | "2";
type SolutionFn<T> = (input: T) => string;

type Solution<T> = {
  parse?: (raw: string) => T;
  part1?: SolutionFn<T>;
  part2?: SolutionFn<T>;
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const { day, part: inputPart } = parse(Deno.args, {
    string: ["day", "part"],
    alias: { day: "d", part: "p" },
  });

  if (!day) {
    console.error(
      `%cMissing day argument`,
      `color: red; font-weight: bold`,
      `Usage: deno run --allow-read main.ts -d <day> [-p <part>]`,
    );
    Deno.exit(1);
  }

  const parts: Part[] = isPart(inputPart) ? [inputPart] : ["1", "2"];

  if (inputPart !== undefined && !isPart(inputPart)) {
    console.error(
      `%cInvalid part argument`,
      `color: red; font-weight: bold`,
      `Usage: deno run --allow-read main.ts -d <day> [-p <part>]`,
    );
    Deno.exit(1);
  }

  const solution = await load(day);

  for (const part of parts) {
    try {
      const input = readInput(day, part);
      if (!input) {
        throw "No input";
      }

      const parse = solution.parse ?? creteNoParse();
      const solve = solution[`part${part}`] ?? createNoSolution();

      for (const { caseNumber, lines } of parseTestCases(input)) {
        console.time(`[SOLUTION] day ${day} | part ${part} | case ${caseNumber}`);
        const output = solve(parse(lines.join("\n")));

        console.timeLog(
            `[SOLUTION] day ${day} | part ${part} | case ${caseNumber}`,
          `= ${output}`,
        );
      }
    } catch (error) {
      if (error === "No solution") {
        console.log(
          `%cNo solution found for day ${day}, part ${part}.`,
          `color: orange; font-weight: bold`,
        );
      } else if (error === "No input") {
        console.log(
          `%cNo input file found for day ${day}, part ${part} :: ./day${day}/input_part${part}.txt`,
          `color: orange; font-weight: bold`,
        );
      } else if (error === "No parse") {
        console.log(
          `%cNo parse function found for day ${day} .`,
          `color: orange; font-weight: bold`,
        );
      } else {
        console.error(
          `%c[ERROR] day ${day} | part ${part} ::`,
          `color: red; font-weight: bold`,
          error,
        );
      }
    }
  }
}

function load<T>(day: string): Promise<Solution<T>> {
  return import(`./day${day}/solution.ts`) as Promise<Solution<T>>;
}

function readInput(day: string, part: string): string | null {
  try {
    return Deno.readTextFileSync(`./day${day}/input_part${part}.txt`);
  } catch {
    return null;
  }
}

function createNoSolution<T>(): SolutionFn<T> {
  return () => {
    throw "No solution";
  };
}

function creteNoParse<T>(): (raw: string) => T {
  return () => {
    throw "No parse";
  };
}

function isPart(part: string | undefined): part is Part {
  return part !== undefined;
}

function parseTestCases(input: string) {
  const testCases: { caseNumber: number; lines: string[] }[] = [];

  const lines = input.split("\n");

  while (lines.length > 0) {
    const candidate = lines.shift();

    if (!candidate?.toLowerCase().startsWith("## test")) {
      continue;
    }

    const caseNumber = parseInt(candidate.split(" ")[2]);
    const caseLines: string[] = [];
    while (!lines[0]?.toLowerCase().startsWith("## end")) {
      caseLines.push(lines.shift() ?? "");
    }

    testCases.push({ caseNumber: caseNumber, lines: caseLines });
  }

  return testCases;
}
