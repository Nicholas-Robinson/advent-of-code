type Input = string[]

export function parse(raw: string): Input {
    return raw.split(/\n/)
}

const DIAL = Array.from({ length: 100 }, (_, i) => i)

export function partOne(input: Input) {
    let pos = 50, cnt = 0
    for (let instruction of input) {
        pos = move(pos, instruction)
        if (pos === 0) cnt++
    }

    return cnt
}

function move(from: number, instruction: string, len = DIAL.length) {
    const direction = instruction[0]
    const distance = Number(instruction.slice(1))
    const delta = direction === 'L' ? -distance : distance

    return wrap(from + delta, len)
}

function wrap(pos: number, len: number) {
    if (pos < 0) return len + pos
    return pos % len
}

export function partTwo(input: Input) {

}