import { List } from "../../../TS-core/utils/list.js";

type Input = [string, string][]

export function parse(raw: string): Input {
    return raw
        .split(",")
        .map(range => range.split("-") as [string, string])
}

export function partOne(input: Input) {
    const invalid = input
        .map(([from, to]) => findInvalidIds(from, to, isInvalidId))
        .filter(list => list.length)
        .flatMap(list => list.map(Number))

    return List.sum(invalid)
}

export function partTwo(input: Input) {
    const invalid = input
        .map(([from, to]) => findInvalidIds(from, to, isComplexInvalidId))
        .filter(list => list.length)
        .flatMap(list => list.map(Number))

    return List.sum(invalid)
}


function findInvalidIds(from: string, to: string, test: (id: string) => boolean) {
    const start = Number(from), end = Number(to);

    return Array
        .from({ length: end - start + 1 }, (_, i) => `${i + start}`)
        .filter(test)
}

function isInvalidId(id: string) {
    if (id.length % 2 === 1) return false

    const head = id.slice(0, id.length / 2)
    const tail = id.slice(id.length / 2)

    return head === tail
}

function isComplexInvalidId(value: string) {
    for (let i = 1; i <= value.length / 2; ++i) {
        const r = new RegExp(value.slice(0, i), 'g')
        const match = value.match(r)

        if (match && match.length === value.length / i) {
            return true
        }
    }

    return false
}
