type WireValues = Record<string, number>
type Mapping = { a: string, b: string, op: (from: number, to: number) => number, to: string }
type Input = { values: WireValues, mappings: Mapping[] }

const OP_CODE_MAPPING: Record<string, (a: number, b: number) => number> = {
    AND: (a: number, b: number) => a & b,
    OR: (a: number, b: number) => a | b,
    XOR: (a: number, b: number) => a ^ b,
}

export function parse(raw: string): Input {
    const [wiresRaw, mappingRaw] = raw.split('\n\n')

    const wires = wiresRaw!.split('\n')
        .map(wire => wire.split(': ') as [string, string])
        .map(([key, value]) => [key, Number(value)] as [string, number])

    const wiresLookup: WireValues = Object.fromEntries(wires)

    const mappings: Mapping[] = []
    for (let rawMapping of mappingRaw!.split('\n')) {
        const [a, opCode, b, _arrow, to] = rawMapping.split(' ')
        mappings.push({ a: a!, b: b!, to: to!, op: OP_CODE_MAPPING[opCode!]! })
    }

    return { mappings, values: wiresLookup }
}

export function partOne({ mappings, values }: Input) {
    let death = 0
    while (mappings.length && death++ < 100_000) {
        const mapping = mappings.shift()!
        const { a, b, op, to } = mapping

        if (values[a] === undefined || values[b] === undefined) {
            mappings.push(mapping)
            continue
        }

        values[to] = op(values[a]!, values[b]!)
    }

    const zValues: number[] = []
    for (let key in values) {
        if (key.startsWith('z')) {
            const index = parseInt(key.slice(1))
            zValues[index] = values[key]!
        }
    }

    return parseInt(zValues.reverse().join(''), 2)
}

export function partTwo(input: Input) {

}