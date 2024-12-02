export function spaceSeparatedLines(input: string, spaces = 1): string[][] {
  return input.split("\n").map((line) => line.split(" ".repeat(spaces)));
}
