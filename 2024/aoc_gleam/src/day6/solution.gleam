import gleam/io
import gleam/list
import gleam/pair
import gleam/result
import gleam/string
import gleam/yielder

pub fn part_one(input: String) -> String {
  input |> parse |> io.debug
  "part one"
}

pub fn part_two(input: String) -> String {
  input
}

fn parse(input: String) {
  let map =
    input
    |> string.split("\n")
    |> list.map(parse_map)

  #(find_start(map), map |> list.map(fn(line) { list.map(line, pair.first) }))
}

fn parse_map(input: String) {
  input
  |> string.split("")
  |> yielder.from_list
  |> yielder.index
  |> yielder.to_list
}

fn find_start(input: List(List(#(String, Int)))) {
  input
  |> yielder.from_list
  |> yielder.index
  |> yielder.map(fn(line) {
    line |> pair.map_first(fn(char) { list.find(char, is_start) })
  })
  |> yielder.filter_map(fn(pair) {
    case pair {
      #(Ok(#(_, x)), y) -> Ok(#(x, y))
      _ -> Error("No start found")
    }
  })
  |> yielder.to_list
}

fn is_start(tuple: #(String, Int)) {
  pair.first(tuple) == "^"
}

fn get_path(lines: List(List(String)), position: #(Int, Int)) {
  todo
}

fn take_step_or_turn_left(
  vec: #(#(Int, Int), #(Int, Int)),
  lines: List(List(String)),
) {
  todo
}
