export const Str = {
    split: (separator: string | RegExp) => (str: string) => str.split(separator),
    bisect: (separator: string | RegExp) => (str: string) => str.split(separator, 2) as [string, string],
    match: (regex: RegExp) => (str: string) => str.match(regex),

    drop: (n: number) => (arr: string): string => arr.slice(n),
    dropEnd: (n: number) => (arr: string): string => arr.slice(0, arr.length - n),

    paragraphs: (str: string) => str.split('\n\n'),
    lines: (str: string) => str.split('\n'),
    words: (str: string) => str.split(' '),
    chars: (str: string) => str.split(''),

    unparagraph: (arr: string[]) => arr.join('\n\n'),
    unlines: (arr: string[]) => arr.join('\n'),
    unwords: (arr: string[]) => arr.join(' '),
    unchars: (arr: string[]) => arr.join(''),
}