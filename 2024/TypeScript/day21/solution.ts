type Input = string[]

const SHORTEST_NUM: Record<string, Record<string, string>> = {
    A: { A: "", 0: "<", 1: "^<<", 2: "^<", 3: "^", 4: "^^<<", 5: "^^<", 6: "^^", 7: "^^^<<<", 8: "^^^<<", 9: "^^^", },
    0: { A: ">", 0: "", 1: "^<", 2: "^", 3: "^>", 4: "^^<", 5: "^^", 6: "^^>", 7: "^^^<", 8: "^^^", 9: "^^^>", },
    1: { A: ">>v", 0: ">v", 1: "", 2: ">", 3: ">>", 4: "^", 5: "^>", 6: "^>>", 7: "^^", 8: "^^>", 9: "^^>>", },
    2: { A: ">v", 0: "v", 1: "<", 2: "", 3: ">", 4: "^<", 5: "^", 6: "^>", 7: "^^<", 8: "^^", 9: "^^>", },
    3: { A: "v", 0: "v<", 1: "<<", 2: "<", 3: "", 4: "^<<", 5: "^<", 6: "^", 7: "^^<<", 8: "^^<", 9: "^^", },
    4: { A: ">>vv", 0: ">vv", 1: "v", 2: ">v", 3: ">>v", 4: "", 5: ">", 6: ">>", 7: "^", 8: "^>", 9: "^>>", },
    5: { A: "vv>", 0: "vv", 1: "v<", 2: "v", 3: "v>", 4: "<", 5: "", 6: ">", 7: "^<", 8: "^", 9: "^>", },
    6: { A: "vv", 0: "vv<", 1: "v<<", 2: "v<", 3: "v", 4: "<<", 5: "<", 6: "", 7: "^<<", 8: "^<", 9: "^", },
    7: { A: ">>vvv", 0: ">vvv", 1: "vv", 2: "vv>", 3: "vv>>", 4: "v", 5: "v>", 6: "v>>", 7: "", 8: ">", 9: ">>", },
    8: { A: "vvv>", 0: "vvv", 1: "vv<", 2: "vv", 3: "vv>", 4: "v<", 5: "v", 6: "v>", 7: "<", 8: "", 9: ">", },
    9: { A: "vvv", 0: "vvv<", 1: "vv<<", 2: "vv<", 3: "vv", 4: "v<<", 5: "v<", 6: "v", 7: "<<", 8: "<", 9: "", },
}

const SHORTEST_ARROW = {
    "^": { "^": "", "A": ">", "<": "v<", "v": "v", ">": "v>" },
    "A": { "^": "<", "A": "", "<": "v<<", "v": "v<", ">": "v" },
    "<": { "^": ">^", "A": ">>^", "<": "", "v": ">", ">": ">>" },
    "v": { "^": "^", "A": "^>", "<": "<", "v": "", ">": ">" },
    ">": { "^": "^<", "A": "^", "<": "<<", "v": "<", ">": "" },
}

export function parse(raw: string): Input {
    return raw.split('\n')
}

const num = [
    [7, 8, 9],
    [4, 5, 6],
    ["BANG", 0, 'A']
]

export function partOne(input: Input) {
    const first = expand('379A', "A", SHORTEST_NUM)
        const second = expand(first, "A", SHORTEST_ARROW)
        const third = expand(second, "A", SHORTEST_ARROW)
    return ['','379A', first, second, third,'<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A'].join('\n')

    // const scores: string[] = []
    // for (let code of input) {
    //     const first = expand(code, "A", SHORTEST_NUM)
    //     const second = expand(first, "A", SHORTEST_ARROW)
    //     const third = expand(second, "A", SHORTEST_ARROW)
    //
    //     scores.push(`${third.length} * ${parseInt(code)} = ${third.length * parseInt(code)}`)
    // }
    //
    // return scores.join('\n')//.reduce((a, b) => a + b)
}

export function partTwo(input: Input) {

}

function expand(input: string, from: string, lookup: Record<string, Record<string, string>>) {
    const path = input.split('')
    let current = from, acc: string[] = [];
    for (let step of path) {
        acc.push(lookup[current]![step]!)
        current = step
    }

    return acc.join('A') + "A"
}

/**
 * 379A
 * ^A^^<<A>>AvvvA
 * <    A    >  A  <         AAv<AA>>^AvAA^Av<AAA^>A
 * v<<A >>^A vA ^A v<<A     >>^AAv<A<A>>^AAvAA^<A>Av<A^>AA<A>Av<A<A>>^AAA<Av>A^A
 * <v<A >>^A vA ^A <vA      <AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
 *
 *     +---+---+
 *     | ^ | A |
 * +---+---+---+
 * | < | v | > |
 * +---+---+---+
 *
 * +---+---+---+
 * | 7 | 8 | 9 |
 * +---+---+---+
 * | 4 | 5 | 6 |
 * +---+---+---+
 * | 1 | 2 | 3 |
 * +---+---+---+
 *     | 0 | A |
 *     +---+---+
 */