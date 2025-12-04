type Input = boolean[][]

const ROLL = '@'

export function parse(raw: string): Input {
    return raw.split('\n').map(line => line.split('').map(c => c === ROLL))
}

export function partOne(input: Input) {
    return cleanHouse(input)
}

export function partTwo(input: Input) {
    let cleaned: number, totalCleaned = cleaned = cleanHouse(input)
    while (cleaned > 0) {
        totalCleaned += cleaned = cleanHouse(input)
    }

    return totalCleaned
}

function cleanHouse(input: Input) {
    let toRemove: [number, number][] = []
    for (let y = 0, yEnd = input.length; y < yEnd; ++y) {
        for (let x = 0, xEnd = input[0]!.length; x < xEnd; ++x) {
            if (input[y]?.[x] && countNeighbouringRolls(input, x, y) < 4) toRemove.push([x, y])
        }
    }

    for (let [x, y] of toRemove) {
        input[y]![x] = false
    }

    return toRemove.length
}

function countNeighbouringRolls(grid: Input, x: number, y: number) {
    if (!grid[y]![x]) return 0

    return +(grid[y + 1]?.[x + 1] == true) +
        +(grid[y + 1]?.[x] == true) +
        +(grid[y + 1]?.[x - 1] == true) +
        +(grid[y]?.[x + 1] == true) +
        +(grid[y]?.[x - 1] == true) +
        +(grid[y - 1]?.[x + 1] == true) +
        +(grid[y - 1]?.[x] == true) +
        +(grid[y - 1]?.[x - 1] == true)
}