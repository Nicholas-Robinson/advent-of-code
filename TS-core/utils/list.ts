export namespace List {

    export function sum(list: number[]): number {
        return list.reduce((sum, i) => sum + i)
    }

}