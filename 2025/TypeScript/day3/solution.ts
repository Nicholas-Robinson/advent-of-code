type Input = number[][]

export function parse(raw: string): Input {
    return raw.split('\n').map(line => line.split('').map(Number))
}

export function partOne(input: Input) {
    return maxJoltageWith(input, 2)
}

export function partTwo(input: Input) {
    return maxJoltageWith(input, 12)
}

function maxJoltageWith(banks: Input, numberOfBats: number) {
    let totalJolatge = 0
    for (let bank of banks) {
        totalJolatge += findLargestJotage(bank, numberOfBats)
    }

    return totalJolatge
}

function findLargestJotage(bank: number[], digitCount: number) {
    let number = '', lastIndex = 0
    for (let i = digitCount - 1; i >= 0; --i) {
        const [biggestIndex, value] = findIndexOfLargest(bank, lastIndex, i)
        lastIndex = biggestIndex + lastIndex + 1
        number += value
    }

    return Number(number)
}

function findIndexOfLargest(bank: number[], start: number, endOffset: number) {
    const list = bank.slice(start, bank.length - endOffset)

    let value: number = 0, pos: number = -1;
    for (let i = 0; i < list.length; ++i) {
        if (list[i]! <= value) continue;
        value = list[i]!;
        pos = i;
    }

    return [pos, list[pos]!] as const
}