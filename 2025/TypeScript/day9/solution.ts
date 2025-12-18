type Point = [x: number, y: number]
type Input = Point[]

export function parse(raw: string): Input {
    return raw.split('\n').map(line => line.split(',').map(Number)) as Point[]
}

export function partOne(input: Input) {
    let largest = 0
    for (let i = 0, iEnd = input.length; i < iEnd; ++i) {
        for (let j = i + 1, jEnd = input.length; j < jEnd; ++j) {
            largest = Math.max(largest, getArea(input[i]!, input[j]!))
        }
    }

    return largest
}

export function partTwo(input: Input) {

}

function getArea([x1, y1]: Point, [x2, y2]: Point) {
    const l = Math.max(x1, x2) - Math.min(x1, x2) + 1
    const h = Math.max(y1, y2) - Math.min(y1, y2) + 1

    return l * h
}