type Input = { grid: boolean[], neighbours: number[][] }

const ROLL = '@'

export function parse(raw: string): Input {
    const grid = raw.split('\n').map(line => line.split('').map(c => c === ROLL));
    return { grid: grid.flatMap(line => line), neighbours: buildNeighboursLookup(grid) }
}

function buildNeighboursLookup(grid: boolean[][]) {
    const height = grid.length, width = grid[0]!.length

    const neighbours: number[][] = []
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const list = []
            if (y - 1 >= 0) {
                list.push((y - 1) * height + x)
                if (x - 1 >= 0) list.push((y - 1) * height + (x - 1))
                if (x + 1 < width) list.push((y - 1) * height + (x + 1))
            }

            if (x - 1 >= 0) list.push(y * height + (x - 1))
            if (x + 1 < width) list.push(y * height + (x + 1))

            if (y + 1 < height) {
                list.push((y + 1) * height + x)
                if (x - 1 >= 0) list.push((y + 1) * height + (x - 1))
                if (x + 1 < width) list.push((y + 1) * height + (x + 1))
            }
            neighbours.push(list)
        }
    }

    return neighbours
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

function cleanHouse({ grid, neighbours }: Input) {
    let toRemove: number[] = []
    for (let i = 0, end = grid.length; i < end; ++i) {
        if (grid[i] && countNeighbouringRolls(grid, neighbours[i]!) < 4) {
            toRemove.push(i)
        }
    }

    for (let i = 0, end = toRemove.length; i < end; ++i) {
        grid[toRemove[i]!] = false
    }

    return toRemove.length
}

function countNeighbouringRolls(grid: boolean[], neighbours: number[]) {
    // @ts-ignore
    return neighbours.reduce((sum, n) => sum + grid[n], 0)
}