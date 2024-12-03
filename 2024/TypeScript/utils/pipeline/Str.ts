export const Str = {
    split: (separator: string | RegExp) => (str: string) => str.split(separator),
    bisect: (separator: string | RegExp) => (str: string) => str.split(separator, 2) as [string, string],
    match: (regex: RegExp) => (str: string) => str.match(regex),

    drop: <T>(n: number) => (arr: string): string => arr.slice(n),
    dropEnd: <T>(n: number) => (arr: string): string => arr.slice(0, arr.length - n),
}