import { createInterface, Interface } from "node:readline/promises";
import * as fs from "node:fs";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { readFileSync } from "fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { InstructionsPrintTask, LoadedEnvPrintTask, Printer, ResultsPrintTask } from "./pinter.js";

const CASE_INTRO = "--- AOC "
const CASE_END = "--- END"

const NS_PER_US = 1000n;
const NS_PER_MS = 1000000n;
const NS_PER_SEC = 1000000000n;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cli: Interface | undefined

let year: string | undefined,
    day: string | undefined,
    part: 1 | 2 = 1;

let solution: (<T>(input: T) => string | Promise<string>) | undefined,
    parser: (<T>(raw: string) => T) | undefined,
    runningInput: string | undefined = undefined,
    runningInputFile: string | undefined = undefined

const resultsPrintTask = new ResultsPrintTask()
const loadedEnvPrintTask = new LoadedEnvPrintTask()
const instructionsPrintTask = new InstructionsPrintTask()

const printer = new Printer(resultsPrintTask, loadedEnvPrintTask, instructionsPrintTask)

while (true) {
    await tick()
}

async function tick() {
    // Clear the terminal
    process.stdout.write('\x1Bc')

    if (cli) cli.close();
    cli = createInterface({ input: process.stdin, output: process.stdout });

    if (year === undefined) return initialiseYear(cli)
    if (day === undefined) return initialiseDay(cli)
    if (![1, 2].includes(part)) return initialisePart(cli)

    instructionsPrintTask.accept({ part })

    const asyncWork = [
        updateSolution(),
        Promise.race([
            watchForChanges(),
            listenForCommands(cli),
        ])
    ]

    printer.print()

    await Promise.all(asyncWork);
}

async function updateSolution() {
    try {
        await readSolution()
        await readInput()

        loadedEnvPrintTask.accept({
            part,
            day: day!,
            year: year!,
            hasParser: !!parser,
            hasSolution: !!solution,
            loadedInput: runningInputFile
        })

        await runSolution()
    } catch (e) {
        console.trace(e)
    }
}

function parsePart(part: string | undefined) {
    return [1, 2].includes(Number(part)) ? Number(part) as 1 | 2 : undefined;
}

async function initialiseYear(cli: Interface) {
    const answer = await cli.question("Run (year [day] [part]): ");
    const [y, d, p] = answer.split(" ");
    if (!y) return initialiseYear(cli)

    year = y;
    day = d;

    const parsed = parsePart(p)
    if (parsed) part = parsed;
}

async function initialiseDay(cli: Interface) {
    day = await cli.question("Run day: ");
}

async function initialisePart(cli: Interface) {
    const answer = parsePart(await cli.question("Run part (1 or 2): "));
    if (!answer) return initialisePart(cli);
    part = answer
}

async function listenForCommands(cli: Interface) {
    console.log()
    const [answer, command] = (await cli.question("")).split(" ");

    switch (answer) {
        case "init": {
            if (year != null && day != null) copyTemplate(year, day)
            break;
        }
        case "toggle": {
            part = [1, 2].find(p => p !== part) as 1 | 2;
            break;
        }
        case "run": {
            // Doing nothing will cause tick and rerun active solution
            break;
        }
        case "part": {
            const parsed = parsePart(command);
            if (!parsed) {
                console.log(`❌  Part can only be 1 or 2 - but got ${command}`)
                break;
            }
            part = parsed;
            break
        }
        case "day": {
            day = command
            break;
        }
        case "year": {
            year = command
            break;
        }
        default: {
            console.log()
            console.log(`❌  I don't know what to do with "${answer}" - try again`)
            return listenForCommands(cli)
        }
    }
}

async function watchForChanges() {
    return new Promise<void>(resolve => {
        try {
            fs.watch(`../${year}/TypeScript/day${day}`, () => resolve())
        } catch (e) {
            console.log(`Could not find a solution for ${year}/TypeScript/day${day}`)
            // Wait forever
        }
    })
}

async function readSolution() {
    try {
        if (!part || !day || !year) return;

        const solutionPath = resolve(__dirname, `../${year}/TypeScript/day${day}/solution.ts`);
        const modulePath = `file://${solutionPath}?t=${Date.now()}`;
        const module = await import(modulePath);

        const suffix = ['', 'One', 'Two'][part];

        parser = module[`parsePart${suffix}`] ?? module[`parse`];
        solution = module[`part${suffix}`]

    } catch (err) {
        solution = undefined;
        parser = undefined;
    }
}

async function readInput() {
    try {
        let fileName = `input.part${part}.txt`
        runningInput = readInputFileContents(fileName);

        if (runningInput === undefined) fileName = `input.txt`;
        runningInput = readInputFileContents(fileName);

        runningInputFile = runningInput === undefined ? undefined : fileName;
    } catch (err) {
        runningInput = undefined;
        runningInputFile = undefined;
    }
}

function readInputFileContents(fileName: string) {
    try {
        return fs.readFileSync(`../${year}/TypeScript/day${day}/${fileName}`).toString();
    } catch (err) {
        return undefined;
    }
}

type CaseDetails = {
    part: 1 | 2;
    name: string;
    lines: string[];
}

async function runSolution() {
    if (!runningInput || !solution || !parser || !part) return;

    resultsPrintTask.reset()

    await Promise.all(
        loadCases(runningInput).map(c => test(c))
    )
}

async function test(c: CaseDetails) {
    if (!runningInput || !solution || !parser || !part) return;

    const tracker = resultsPrintTask.make()
    tracker.set({ status: 'running', label: `${c.name} [${c.part}]` })

    const input = parser(c.lines.join('\n'))
    const start = process.hrtime.bigint()

    try {
        const result = await solution(input);
        tracker.set({ status: 'complete', timeTaken: getFormattedDuration(start), result })
    } catch (e) {
        tracker.set({
            status: 'failed',
            timeTaken: getFormattedDuration(start),
            trace: new Error('Case failed', { cause: e })
        })
    }
}

function loadCases(raw: string) {
    const cases: CaseDetails[] = [];

    let caseDetails: CaseDetails = { name: "", part, lines: [] },
        isInScope = false;

    for (let line of raw.split("\n")) {
        if (!isInScope && line.trim() === "") {
            continue;
        }

        if (line.startsWith(CASE_INTRO)) {
            const [p, name] = line.slice(CASE_INTRO.length).split("|");
            caseDetails.part = parsePart(p) ?? part;
            caseDetails.name = name?.trim() ?? "Input";
            caseDetails.lines = []

            isInScope = true;
        } else if (isInScope && line.startsWith(CASE_END)) {
            cases.push(caseDetails);
            caseDetails = { name: "", part, lines: [] }

            isInScope = false;
        } else if (isInScope) {
            caseDetails.lines.push(line);
        }
    }

    if (caseDetails.lines.length > 1) {
        caseDetails.name ??= "Default case"
        caseDetails.part ??= 1;
        cases.push(caseDetails);
    }

    return cases;
}

function copyTemplate(year: string, day: string) {
    const dir = `../${year}/TypeScript/day${day}`
    execSync(`mkdir ${dir}`);

    const solution = `${dir}/solution.ts`;
    execSync(`touch ${solution}`);
    writeFileSync(solution, readFileSync(`./__template/day/solution.ts`));

    const input = `${dir}/input.txt`;
    execSync(`touch ${input}`);
    writeFileSync(input, readFileSync(`./__template/day/input.txt`));
    writeFileSync(input, readFileSync(`./__template/day/input.txt`));
}

function getFormattedDuration(startTimeNs: bigint) {
    const endTimeNs = process.hrtime.bigint();
    let totalDurationNs = endTimeNs - startTimeNs;

    if (totalDurationNs < 0n) {
        totalDurationNs = 0n;
    }

    // 1. Calculate Seconds (s)
    const seconds = totalDurationNs / NS_PER_SEC;
    totalDurationNs %= NS_PER_SEC;

    // 2. Calculate Milliseconds (ms)
    const milliseconds = totalDurationNs / NS_PER_MS;
    totalDurationNs %= NS_PER_MS;

    // 3. Calculate Microseconds (µs)
    const microseconds = totalDurationNs / NS_PER_US;

    return [
        seconds > 0 ? `${seconds}s` : undefined,
        milliseconds > 0 ? `${milliseconds}ms` : undefined,
        microseconds > 0 ? `${microseconds}µs` : undefined,
    ].filter(Boolean).join(' ')
}