type Coord = [number, number]
type Machine = { A: Coord, B: Coord, prize: Coord }
type Input = Machine[]

export function parse(raw: string) {
    const machines: Machine[] = []
    for (let block of raw.split('\n\n')) {
        const [rawA, rawB, rawPrize] = block.split('\n')

        const [, ax, ay] = rawA!.match(/Button A: X\+(\d+), Y\+(\d+)/)!
        const [, bx, by] = rawB!.match(/Button B: X\+(\d+), Y\+(\d+)/)!
        const [, px, py] = rawPrize!.match(/Prize: X=(\d+), Y=(\d+)/)!

        machines.push({
            A: [Number(ax), Number(ay)],
            B: [Number(bx), Number(by)],
            prize: [Number(px), Number(py)],
        })
    }

    return machines
}

export function partOne(input: Input) {
    for (let { A, B, prize } of input) {
        return JSON.stringify(intersect([0, 0], A, B, prize))
    }
    return JSON.stringify(input)
}

export function partTwo(input: Input) {

}

function intersect([x1, y1]: Coord, [x2, y2]: Coord, [x3, y3]: Coord, [x4, y4]: Coord) {
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    if (denominator === 0) {
        return false
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    //     return false
    // }

    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1)
    }
}