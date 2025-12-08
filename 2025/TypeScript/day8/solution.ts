import * as querystring from "node:querystring";
import * as net from "node:net";

type Input = Point[]

export function parse(raw: string): Input {
    return raw.split('\n').map(Point.from)
}

const ITERATIONS = 10

export function partOne(input: Input) {
    const distancePairs: [Point, Point, number][] = []
    for (let a = 0, aEnd = input.length; a < aEnd; ++a) {
        for (let b = a + 1, bEnd = input.length; b < bEnd; ++b) {
            distancePairs.push([input[a]!, input[b]!, distance(input[a]!, input[b]!)])
        }
    }

    // const networks = new Map<Point, Network>()
    // for (let a of input) {
    //     for (let b of input) {
    //         if (a !== b) distancePairs.push([a, b, distance(a, b)])
    //         if (!networks.has(a)) networks.set(a, new Network(a))
    //         if (!networks.has(b)) networks.set(b, new Network(b))
    //     }
    // }
    distancePairs.sort(([, , a], [, , b]) => a - b)

    const networks = new Map(input.map(point => [point, new Network(point)]))

    for (let i = 0; i < ITERATIONS; ++i) {
        const [a, b] = distancePairs[i]!
        const merged = networks.get(a)!.merge(networks.get(b)!)
        networks.set(a, merged)
        networks.set(b, merged)
    }

    const unique = Array.from(new Set(networks.values())).map(net => net.size)
        .toSorted((a, b) => b - a)
        .slice(0, 3)
        // .reduce((a, b) => a * b)

    return unique
}

export function partTwo(input: Input) {

}

function distance({ point: [x1, y1, z1] }: Point, { point: [x2, y2, z2] }: Point) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2)
}

class Point {
    static from(raw: string) {
        return new Point(raw.split(",").map(Number) as [number, number, number])
    }

    constructor(
        readonly point: [number, number, number],
    ) {
    }
}

class Network {
    private points = new Set<Point>()

    constructor(initialPoint: Point) {
        this.points.add(initialPoint)
    }

    get size() {
        return this.points.size
    }

    merge(other: Network) {
        this.points = this.points.union(other.points)
        return this
    }

}