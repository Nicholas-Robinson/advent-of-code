export const Str = {
  split: (separator: string | RegExp) => (str: string) => str.split(separator),
  bisect: (separator: string | RegExp) => (str: string) =>
    str.split(separator, 2) as [string, string],

  match: (regex: RegExp) => (str: string) => str.match(regex),
  includes: (substring: string) => (str: string) => str.includes(substring),

  drop: (n: number) => (arr: string): string => arr.slice(n),
  dropEnd: (n: number) => (arr: string): string => arr.slice(0, arr.length - n),

  paragraphs: (str: string): string[] => str.split("\n\n"),
  lines: (str: string): string[] => str.split("\n"),
  words: (str: string): string[] => str.split(" "),
  chars: (str: string): string[] => str.split(""),

  unparagraph: (arr: string[]): string => arr.join("\n\n"),
  unlines: (arr: string[]): string => arr.join("\n"),
  unwords: (arr: string[]): string => arr.join(" "),
  unchars: (arr: string[]): string => arr.join(""),
};
