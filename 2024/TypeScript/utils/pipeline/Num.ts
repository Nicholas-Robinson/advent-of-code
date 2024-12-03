export const Num = {

    sumAll: (arr: number[]): number => arr.reduce((acc, curr) => acc + curr, 0),
    subtractAll: (arr: number[]): number => arr.reduce((acc, curr) => acc - curr, 0),
    multiplyAll: (arr: number[]): number => arr.reduce((acc, curr) => acc * curr, 1),
    divideAll: (arr: number[]): number => arr.reduce((acc, curr) => acc / curr, 1),

}