type Input = number[][]

export function parse(raw: string): Input {
    return raw.split('\n').map(line => line.split('').map(Number))
}

export function partOne(input: Input) {
    return maxJoltageWith(input, 2)
}

export function partTwo(input: Input) {
    return maxJoltageWith(input, 12);
}

function maxJoltageWith(banks: Input, numberOfBats: number) {
    let totalJolatge = 0
    for (let i = 0, end = banks.length; i < end; ++i) {
        totalJolatge += findLargestJotage(banks[i]!, numberOfBats)
    }

    return totalJolatge
}

function findLargestJotage(bank: number[], digitCount: number) {
    let number = 0, lastIndex = 0, biggestIndex: number
    for (let i = digitCount - 1; i >= 0; --i) {
        biggestIndex = findIndexOfLargest(bank, lastIndex, i)
        lastIndex = biggestIndex + 1
        number = number * 10 + bank[biggestIndex]!
    }

    return number
}

function findIndexOfLargest(bank: number[], start: number, endOffset: number) {
    const list = bank

    let value: number = 0, pos: number = -1;
    for (let i = start, end = bank.length - endOffset; i < end; ++i) {
        if (list[i]! > value) {
            value = list[i]!;
            pos = i;
        }
    }

    return pos
}