type Input = { keys: number[][], locks: number[][] }

export function parse(raw: string) {
    const keys: number[][] = [],
        locks: number[][] = []

    for (let template of raw.split("\n\n")) {
        const templateFoo = template.split('\n')
        if (templateFoo[0]!.split('').every(c => c === '#')) locks.push(parseTemplate(templateFoo))
        else keys.push(parseTemplate(templateFoo))
    }

    return { keys, locks }
}

function parseTemplate(template: string[]) {
    const transposed: string[] = []
    for (let i = 0, iEnd = template.length; i < iEnd; ++i) {
        for (let j = 0, jEnd = template[i]!.length; j < jEnd; ++j) {
            transposed[j] = (transposed[j] ?? '') + template[i]![j]!
        }
    }

    return transposed.map(line => line.replaceAll('.', '').length - 1)
}

export function partOne({ keys, locks }: Input) {
    const output = []
    for (let lock of locks) {
        for (let key of keys) {
            const value = []
            for (let pin = 0, end = key.length; pin < end; ++pin) {
                value.push(key[pin]! + lock[pin]!)
            }
            output.push(value)
        }
    }

    return output
        .filter(set => set.every(bind => bind <= 5))
        .length
}

export function partTwo(input: Input) {

}