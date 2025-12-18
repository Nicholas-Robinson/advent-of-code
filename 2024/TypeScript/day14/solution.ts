type Input = [Robot[], Pair]

export function parse(raw: string): Input {
    const [dim, ...robotsRaw] = raw.split('\n')

    const [w, h] = dim!.split(',')

    const robots = robotsRaw.map(line => {
        const [, x, y, dx, dy] = line.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)!
        return new Robot([Number(x), Number(y)], [Number(dx), Number(dy)])
    })

    return [robots, [Number(w), Number(h)]]
}

export function partOne([robots, [width, height]]: Input) {
    for (let i = 0; i < 100; ++i) {
        robots.forEach(robot => robot.step(width, height))
    }

    const grid: number[][] = Array.from({ length: height }, () => Array(width).fill(0))
    robots.forEach(robot => robot.print(grid))

    const a = [
        topRightQuad(grid),
        topLeftQuad(grid),
        bottomRightQuad(grid),
        bottomLeftQuad(grid),
    ]

    return a
        .map(q => q.flat().filter(n => n).reduce((a, b) => a + b))
        .reduce((a, b) => a * b)
}

export function partTwo([robots, [width, height]]: Input) {
    let iteration = 0
    while (iteration++ < 1_000_000) {
        robots.forEach(robot => robot.step(width, height))

        const grid: number[][] = Array.from({ length: height }, () => Array(width).fill(0))
        robots.forEach(robot => robot.print(grid))

        let sum = 0, largest = -1
        for (let row of grid) {
            for (let i of row) {
                if (i !== 0) {
                    sum++
                    continue
                }

                largest = Math.max(sum, largest)
                sum = 0
            }
        }

        if (largest > 12) {
            return iteration
        }
    }

    return -1
}

type Pair = [number, number]

class Robot {
    constructor(
        private location: Pair,
        private readonly velocity: Pair,
    ) {
    }

    step(width: number, height: number) {
        this.location[0] = clamp(this.location[0] + this.velocity[0], width)
        this.location[1] = clamp(this.location[1] + this.velocity[1], height)
    }

    print(grid: number[][]) {
        grid[this.location[1]!]![this.location[0]!]!++
    }
}

function clamp(value: number, max: number) {
    if (value < 0) return max + value
    if (value >= max) return value % max
    return value
}

function topLeftQuad(grid: number[][]) {
    const rows = grid.slice(0, Math.floor(grid.length / 2))
    return rows.map(line => line.slice(0, Math.floor(line.length / 2)))
}

function topRightQuad(grid: number[][]) {
    const rows = grid.slice(0, Math.floor(grid.length / 2))
    return rows.map(line => line.slice(Math.floor(line.length / 2) + 1))
}

function bottomLeftQuad(grid: number[][]) {
    const rows = grid.slice(Math.floor(grid.length / 2) + 1)
    return rows.map(line => line.slice(0, Math.floor(line.length / 2)))
}

function bottomRightQuad(grid: number[][]) {
    const rows = grid.slice(Math.floor(grid.length / 2) + 1)
    return rows.map(line => line.slice(Math.floor(line.length / 2) + 1))
}