type Problem = { numbers: number[], operation?: (x: number, y: number) => number, base?: number };
type Input = Problem[];

export function parsePartOne(raw: string) {
    const problems: Problem[] = []
    for (let line of raw.split("\n")) {
        line.replaceAll(/\s+/g, " ").trim().split(" ").forEach((number, index) => {
            if (problems[index] == undefined) problems[index] = { numbers: [] }
            if (problems[index].operation) return

            if (number === "+" || number === "*") {
                problems[index].base = number === "+" ? 0 : 1

                problems[index].operation = number === "+"
                    ? (x: number, y: number) => x + y
                    : (x: number, y: number) => x * y
            } else {
                problems[index].numbers.push(Number(number))
            }
        })
    }
    return problems
}


export function parsePartTwo(raw: string) {
    const rows = raw.split("\n")

    const height = rows.findIndex(line => line.startsWith("+") || line.startsWith("*"))
    const ns = rows.map(line => line.split("")).slice(0, height)
    const ops = rows.slice(height)[0]!.replaceAll(/\s+/g, " ").split(" ")

    let cols: number[] = [], problems: Problem[] = []
    while (ns.some(n => n.length)) {
        const col = ns.map(line => line.shift()).join("").trim()

        if (col === "") {
            const op = ops.shift()
            problems.push({
                numbers: cols,
                base: op === "+" ? 0 : 1,
                operation: op === "+"
                    ? (x: number, y: number) => x + y
                    : (x: number, y: number) => x * y,
            })
            cols = []
        } else {
            cols.push(Number(col.trim()))
        }
    }

    const op = ops.shift()
    problems.push({
        numbers: cols,
        base: op === "+" ? 0 : 1,
        operation: op === "+"
            ? (x: number, y: number) => x + y
            : (x: number, y: number) => x * y,
    })

    return problems
}

export function partOne(input: Input) {
    let total = 0
    for (let i = 0, end = input.length; i < end; ++i) {
        total += solve(input[i]!)
    }

    return total
}

export function partTwo(input: Input) {
    return partOne(input)
}

function solve(problem: Problem) {
    let answer = problem.base!
    for (let j = 0, jend = problem.numbers.length; j < jend; ++j) {
        answer = problem.operation!(answer, problem.numbers[j]!)
    }

    return answer
}