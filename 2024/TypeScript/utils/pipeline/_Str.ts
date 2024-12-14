import { pipe } from "./_pipe.ts";
import { _Arr } from "./_Arr.ts";

export const _Str = {
  split: (separator: string | RegExp) => (str: string) => str.split(separator),
  bisect: (separator: string | RegExp) => (str: string) =>
    str.split(separator, 2) as [string, string],

  match: (regex: RegExp) => (str: string) => str.match(regex) ?? [],
  matchGroups: (regex: RegExp) => (str: string) =>
    pipe(str, _Str.match(regex), _Arr.drop(1)),
  includes: (substring: string) => (str: string) => str.includes(substring),

  drop: (n: number) => (str: string): string => str.slice(n),
  dropEnd: (n: number) => (str: string): string => str.slice(0, str.length - n),
  dropWhile: (predicate: (char: string) => boolean) => (str: string): string =>
    pipe(str, _Str.chars, _Arr.dropWhile(predicate), _Str.unchars),

  take: (n: number) => (str: string): string => str.slice(0, n),

  paragraphs: (str: string): string[] => str.split("\n\n"),
  lines: (str: string): string[] => str.split("\n"),
  words: (str: string): string[] => str.split(" "),
  chars: (str: string): string[] => str.split(""),

  unparagraph: (arr: string[]): string => arr.join("\n\n"),
  unlines: (arr: string[]): string => arr.join("\n"),
  unwords: (arr: string[]): string => arr.join(" "),
  unchars: (arr: string[]): string => arr.join(""),
};
