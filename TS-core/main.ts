import { createInterface, Interface } from "node:readline/promises";
import * as fs from "node:fs";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { readFileSync } from "fs";
import { createRequire } from "node:module";

const CASE_INTRO = "--- AOC "
const CASE_END = "--- END"

const require = createRequire(import.meta.url);

let cli: Interface | undefined

let year: string | undefined,
    day: string | undefined,
    part: 1 | 2 = 1;

let solution: (<T>(input: T) => string | Promise<string>) | undefined,
    parser: (<T>(raw: string) => T) | undefined,
    runningInput: string | undefined = undefined,
    runningInputFile: string | undefined = undefined

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

    await readSolution()
    await readInput()
    await runSolution()

    printInstructions(year, day);

    await Promise.race([
        watchForChanges(),
        listenForCommands(cli),
    ])
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

function printInstructions(year: string, day: string) {
    console.log(`🚀 Running :: Day ${day}, ${year} | Part ${part}`);

    console.log()
    const suffix = ['', 'One', 'Two'][part];
    if (parser) console.log(`✅  Found parser`);
    else console.log(`⚠️  Could not find a parser called: parse or parsePart${suffix}`)
    if (solution) console.log(`✅  Loaded solution: part${suffix}`);
    else console.log(`⚠️  Could not find a solution called: part${suffix}`)
    if (runningInput !== undefined) console.log(`✅  Running input: ${runningInputFile}`);
    else console.log(`⚠️  No input.txt or input.part${part}.txt found`)

    console.log()
    console.log("Available commands")
    console.log("• init \t\t=> Initialise the day's solution")
    if (part === 1) console.log("• toggle \t=> Activate part 2")
    if (part === 2) console.log("• toggle \t=> Activate part 1")
    console.log("• run \t\t=> Run solution")
    console.log("• part [number] => Set the active part")
    console.log("• day  [number] => Set the active day")
    console.log("• year [number] => Set the active year")
}

async function listenForCommands(cli: Interface) {
    console.log()
    const [answer, command] = (await cli.question("Command: ")).split(" ");

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
        const module = require(`../${year}/TypeScript/day${day}/solution.ts?new=${Date.now()}`);
        if (!part || !day || !year) return;

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
    const cases = loadCases(runningInput)

    for await (const c of cases) {
        if (part !== c.part) continue;
        console.log(`${c.name} [${c.part}] :: Running...`);
        const input = parser(c.lines.join('\n'))
        const answer = await solution(input);
        console.log(`${c.name} [${c.part}] :: ${answer}`)
    }

    console.log()
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
            const [p, name] = line.slice(CASE_INTRO.length).split(" | ");
            caseDetails.part = parsePart(p) ?? part;
            caseDetails.name = name ?? "Input";
            caseDetails.lines = []

            isInScope = true;
        } else if (line.startsWith(CASE_END)) {
            cases.push(caseDetails);
            caseDetails = { name: "", part, lines: [] }

            isInScope = false;
        } else {
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