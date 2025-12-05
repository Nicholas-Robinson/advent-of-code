type Range = [number, number]
type Tester = (id: number) => boolean
type Input = { ranges: Range[], ids: number[] }

export function parse(raw: string): Input {
    const [rangesRaw, idsRaw] = raw.split('\n\n')

    const ranges = rangesRaw!.split('\n').map(range =>
        range.split('-').map(Number) as Range
    )

    const ids = idsRaw!.split('\n').map(Number)

    return { ranges, ids }
}

export function partOne(input: Input) {
    const isFreshId = makeIsFreshFilter(input.ranges)
    return input.ids.filter(isFreshId).length
}

export function partTwo(input: Input) {
    let ranges = input.ranges, last = Infinity
    while (true) {
        const adjustedRanges: [Range, Tester][] = []
        for (let range of ranges) {

            const other = adjustedRanges
                .find(([, test]) => test(range[0]) || test(range[1]))

            if (!other) {
                adjustedRanges.push([range, makeRangeTester(range)])
                continue
            }

            other[0] = [Math.min(other[0][0], range[0]), Math.max(other[0][1], range[1])]
            other[1] = makeRangeTester(other[0])
        }

        const total = adjustedRanges
            .map(([[from, to]]) => to - from + 1)
            .reduce((a, b) => a + b)

        ranges = adjustedRanges.map(([r]) => r).reverse()

        if (total === last) break
        last = total
    }

    return last
}

function makeIsFreshFilter(ranges: Range[]) {
    const testers = ranges.map(makeRangeTester)
    return (id: number) => testers.some(test => test(id))
}

function makeRangeTester([from, to]: Range) {
    return (id: number) => id >= from && id <= to
}