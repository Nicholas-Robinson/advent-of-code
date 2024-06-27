import gleam/int
import gleam/list
import gleam/result
import gleam/string

pub fn part_one(input: String) {
  input
  |> string.split("\n")
  |> list.map(fn(line) {
    let chars = string.split(line, "")
    result.all([
      find_first_number(chars),
      find_first_number(list.reverse(chars)),
    ])
  })
  |> list.map(fn(result) {
    let assert Ok([a, b]) = result
    10 * a + b
  })
  |> int.sum
  |> int.to_string
}

fn find_first_number(line: List(String)) -> Result(Int, Nil) {
  let parsed = case line {
    ["o", "n", "e", ..] | ["e", "n", "o", ..] -> Ok(1)
    ["t", "w", "o", ..] | ["o", "w", "t", ..] -> Ok(2)
    ["t", "h", "r", "e", "e", ..] | ["e", "e", "r", "h", "t", ..] -> Ok(3)
    ["f", "o", "u", "r", ..] | ["r", "u", "o", "f", ..] -> Ok(4)
    ["f", "i", "v", "e", ..] | ["e", "v", "i", "f", ..] -> Ok(5)
    ["s", "i", "x", ..] | ["x", "i", "s", ..] -> Ok(6)
    ["s", "e", "v", "e", "n", ..] | ["n", "e", "v", "e", "s", ..] -> Ok(7)
    ["e", "i", "g", "h", "t", ..] | ["t", "h", "g", "i", "e", ..] -> Ok(8)
    ["n", "i", "n", "e", ..] | ["e", "n", "i", "n", ..] -> Ok(9)
    [head, ..] -> int.parse(head)
    [] -> Error(Nil)
  }

  case parsed, line {
    Ok(digit), _ -> Ok(digit)
    Error(_), [_, ..tail] -> find_first_number(tail)
    Error(_), _ -> Error(Nil)
  }
}

pub fn part_two(input: String) {
  part_one(input)
}
