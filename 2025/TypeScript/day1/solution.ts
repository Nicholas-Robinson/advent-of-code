type Input = string[]

export function parse(raw: string): Input {
    return raw.split(/\n/)
}

const DIAL = Array.from({ length: 100 }, (_, i) => i)

export function partOne(input: Input) {
    let pos = 50, cnt = 0
    for (let instruction of input) {
        pos = move(pos, instruction)
        if (pos % DIAL.length === 0) cnt++
    }

    return cnt
}

function move(from: number, instruction: string) {
    const direction = instruction[0]
    const distance = parseInt(instruction.slice(1))
    const delta = direction === 'L' ? -distance : distance

    return from + delta
}

export function partTwo(input: Input) {
    let pos = 50, cnt = 0
    for (let instruction of input) {
        const path = moves(pos, instruction)
        pos = path.at(-1)!
        cnt += path.filter(x => x % DIAL.length === 0).length
    }

    return cnt
}

function moves(from: number, instruction: string) {
    const direction = instruction[0]
    const distance = parseInt(instruction.slice(1))
    const delta = direction === 'L' ? -1 : 1

    let ret = []
    for (let i = 1; i <= distance; i++) {
        ret.push(from += delta)
    }

    return ret
}