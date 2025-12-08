type Input = (string | number)[][]

export function parse(raw: string): Input {
    return raw.split("\n").map(line => line.split(""))
}

export function partOne(input: Input) {
    // Running part 2 will set up the input to count the splits
    partTwo(input)

    return input
        .map(line => line.filter(cell => cell === "@").length)
        .reduce((x, y) => x + y)
}

export function partTwo(input: Input) {
    const start = input[0]!.indexOf("S")
    return exploreRec(input, [start, 1])
}

function exploreRec(input: Input, [x, y]: [number, number]): number {
    const cell = input[y]?.[x]

    if (cell === undefined) return 1
    if (typeof cell === "number") return cell

    if (cell === ".") {
        const value = exploreRec(input, [x, y + 1])
        input[y]![x] = value
        return value
    }

    if (cell === "^") {
        input[y]![x] = "@"
        return exploreRec(input, [x - 1, y]) + exploreRec(input, [x + 1, y])
    }

    return 0
}