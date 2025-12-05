type Range = [from: number, to: number, len: number]
type RangeMatch = (from: number) => number | null

type Input = {
    seeds: number[]
    map: (from: number) => number
}

export function parse(raw: string): Input {
    const [seedsRaw, ...mapsRaw] = raw.split('\n\n')

    const seeds = seedsRaw!.split(' ').slice(1).map(Number)

    const [sts, stf, ftw, wtl, ltt, tth, htl] = mapsRaw
        .map(block =>
            block
                .split('\n')
                .slice(1)
                .map(line => line.split(' ').map(Number) as Range)
        )
        .map(buildRangeListMater)

    return { seeds, map: from => htl!(tth!(ltt!(wtl!(ftw!(stf!(sts!(from))))))) }
}

export function partOne({ seeds, map }: Input) {
    let lowest = Infinity
    for (let seed of seeds) {
        lowest = Math.min(lowest, map(seed))
    }

    return lowest
}

export function partTwo({ seeds, map }: Input) {
    let lowest = Infinity
    for (let i = 0, end = seeds.length; i < end; i += 2) {
        const from = seeds[i]!
        const to = seeds[i + 1]!

        for (let x = from, end = from + to; x < end; ++x) {
            lowest = Math.min(lowest, map(x))
        }
    }

    return lowest
}

function buildRangeListMater(ranges: Range[]) {
    const matchers = ranges.map(buildRangeMatcher)

    return (x: number) => {
        for (let match of matchers) {
            const res = match(x)
            if (res != null) return res
        }

        return x
    }
}

function buildRangeMatcher([to, from, len]: Range) {
    return (x: number) => x >= from && x < from + len ? x + (to - from) : null
}