type Range = [number, number]
type Tester = (range: Range) => boolean
type Input = { ranges: Range[], ids: number[] }

export function parse(raw: string): Input {
    const [rangesRaw, idsRaw] = raw.split('\n\n')

    const ranges = rangesRaw!.split('\n').map(range =>
        range.split('-').map(Number) as Range
    ).sort((a, b) => a[0] - b[0])

    const ids = idsRaw!.split('\n').map(Number)

    return { ranges, ids }
}

export function partOne(input: Input) {
    const isFreshId = makeIsFreshFilter(input.ranges)
    return input.ids.filter(isFreshId).length
}

export function partTwo(input: Input) {
    const adjustedRanges: [Range, Tester][] = []

    for (let i = 0, end = input.ranges.length; i < end; ++i) {
        const range = input.ranges[i]!

        let merged = false
        for (let j = 0, je = adjustedRanges.length; j < je && !merged; ++j) {
            const other = adjustedRanges[j]!
            if (other[1]!(range)) {
                other[0] = [Math.min(other[0][0], range[0]), Math.max(other[0][1], range[1])]
                other[1] = makeRangeRangeTester(other[0])
                merged = true
            }
        }

        if (!merged) adjustedRanges.push([range, makeRangeRangeTester(range)])
    }

    let answer = 0
    for (let i = 0, end = adjustedRanges.length; i < end; ++i) {
        answer += adjustedRanges[i]![0][1] - adjustedRanges[i]![0][0] + 1
    }

    return answer
}

function makeIsFreshFilter(ranges: Range[]) {
    const testers = ranges.map(makeRangeTester)
    return (id: number) => testers.some(test => test(id))
}

function makeRangeTester([from, to]: Range) {
    return (id: number) => id >= from && id <= to
}

function makeRangeRangeTester([from, to]: Range) {
    return ([f, t]: Range) => (f >= from && f <= to) || (t >= from && t <= to)
}