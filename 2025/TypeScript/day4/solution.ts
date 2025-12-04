type Input = string[][]
type NeighbourMap = number[][]

export function parse(raw: string): Input {
    return raw.split('\n').map(line => line.split(''))
}

export function partOne(input: Input) {
    return cleanHouse(mapNeighbours(input), input)
}

export function partTwo(input: Input) {
    const map = mapNeighbours(input)

    let cleaned: number, totalCleaned = cleaned = cleanHouse(map, input)
    while (cleaned > 0) {
        totalCleaned += cleaned = cleanHouse(map, input)
    }

    return totalCleaned
}

function mapNeighbours(grid: Input): NeighbourMap {
    const map = Array.from({ length: grid.length }, () => Array(grid[0]!.length).fill(0))

    for (let y = 0, yEnd = grid.length; y < yEnd; ++y) {
        for (let x = 0, xEnd = grid[0]!.length; x < xEnd; ++x) {
            map[y]![x] = countNeighbouringRolls(grid, x, y)
        }
    }

    return map as NeighbourMap
}

function countNeighbouringRolls(grid: Input, x: number, y: number) {
    if (grid[y]![x] != '@') return 0

    return +(grid[y + 1]?.[x + 1] == '@') +
        +(grid[y + 1]?.[x] == '@') +
        +(grid[y + 1]?.[x - 1] == '@') +
        +(grid[y]?.[x + 1] == '@') +
        +(grid[y]?.[x - 1] == '@') +
        +(grid[y - 1]?.[x + 1] == '@') +
        +(grid[y - 1]?.[x] == '@') +
        +(grid[y - 1]?.[x - 1] == '@')
}

function cleanHouse(map: NeighbourMap, input: Input) {
    let cleaned = 0
    for (let y = 0, yEnd = map.length; y < yEnd; ++y) {
        for (let x = 0, xEnd = map[0]!.length; x < xEnd; ++x) {
            if (input[y]![x]! === '@' && map[y]![x]! != null &&  map[y]![x]! < 4) {
                map[y + 1]?.[x + 1] && map[y + 1]![x + 1]!--;
                map[y + 1]?.[x] && map[y + 1]![x]!--;
                map[y + 1]?.[x - 1] && map[y + 1]![x - 1]!--;
                map[y]?.[x + 1] && map[y]![x + 1]!--;
                map[y]?.[x - 1] && map[y]![x - 1]!--;
                map[y - 1]?.[x + 1] && map[y - 1]![x + 1]!--;
                map[y - 1]?.[x] && map[y - 1]![x]!--;
                map[y - 1]?.[x - 1] && map[y - 1]![x - 1]!--;

                map[y]![x] = 0;
                input[y]![x]! = '.';

                cleaned++;
            }
        }
    }

    return cleaned
}