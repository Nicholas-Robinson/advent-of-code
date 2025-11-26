type Input = string[]

export function parse(raw: string): Input {
    return raw.split('')
}

export function partOne(input: Input) {
    let depth = 0
    for (let b of input) {
        depth += b === '(' ? 1 : -1
    }

    return depth
}

export function partTwo(input: Input) {
    let depth = 0
    for (let i = 0; i < input.length; i++) {
        const b = input[i]
        depth += b === '(' ? 1 : -1

        if (depth < 0) return i + 1
    }

    return 0
}