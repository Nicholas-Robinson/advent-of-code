type Input = [number, number, number][]

export function parse(raw: string): Input {
    return raw.split('\n').map(line => line.split('x').map(Number)) as Input
}

export function partOne(input: Input) {
    return input
        .map(computeRequiredPaper)
        .reduce((x, y) => x + y)
}

export function partTwo(input: Input) {
    return input
        .map(computeRequiredRibbon)
        .reduce((x, y) => x + y)
}

function computeRequiredPaper([l, w, h]: [number, number, number]) {
    const a = l * w
    const b = w * h
    const c = h * l

    const smallest = Math.min(a, Math.min(b, c))
    return (2 * a) + (2 * b) + (2 * c) + smallest
}

function computeRequiredRibbon([l, w, h]: [number, number, number]) {
    const bow = l * w * h
    const [a, b] = [l, w, h].sort() as [number, number, number]

    return a + a + b + b + bow
}