type Point = [number, number, number]
type Input = [iterations: number, points: [string, string, number][], locations: string[]]

export function parse(raw: string): Input {
    const [cnt, ...points] = raw.split("\n")

    let pairs: [string, string, number][] = []
    for (let i = 0, end = points.length; i < end; ++i) {
        const from = points[i]!.split(',').map(Number) as Point
        for (let j = i + 1; j < end; ++j) {
            const to = points[j]!.split(',').map(Number) as Point
            pairs.push([points[i]!, points[j]!, distance(from, to)])
        }
    }

    return [
        Number(cnt),
        pairs.toSorted(([, , a], [, , b]) => a - b),
        points
    ]
}

export function partOne([iterations, input]: Input) {
    let circuits: Set<string>[] = []
    for (let i = 0; i < iterations; ++i) {
        const [from, to] = input[i]!

        const unchanged: Set<string>[] = [], toLink: Set<string>[] = []
        for (let circuit of circuits) {
            if (circuit.has(from) || circuit.has(to)) toLink.push(circuit)
            else unchanged.push(circuit)
        }

        const circuit = toLink.reduce((a, b) => a.union(b), new Set())
        circuit.add(from)
        circuit.add(to)

        unchanged.push(circuit)
        circuits = unchanged
    }

    return circuits
    .toSorted((a, b) => b.size - a.size)
    .slice(0, 3)
    .map(s => s.size)
    .reduce((a, b) => a * b)
}

export function partTwo([, input, points]: Input) {
    let circuits: Set<string>[] = points.map(point => new Set([point])),
        last: [string, string],
        i = 0

    while (circuits.length > 1 && i < input.length) {
        const [from, to] = input[i++]!
        last = [from, to]

        const unchanged: Set<string>[] = [], toLink: Set<string>[] = []
        for (let circuit of circuits) {
            if (circuit.has(from) || circuit.has(to)) toLink.push(circuit)
            else unchanged.push(circuit)
        }

        const circuit = toLink.reduce((a, b) => a.union(b), new Set())
        circuit.add(from)
        circuit.add(to)

        unchanged.push(circuit)
        circuits = unchanged
    }

    const [from, to] = last!
    const [x1] = from!.split(',')
    const [x2] = to!.split(',')

    return Number(x1) * Number(x2)
}

function distance([x1, y1, z1]: Point, [x2, y2, z2]: Point) {
    return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2) + ((z2 - z1) ** 2))
}