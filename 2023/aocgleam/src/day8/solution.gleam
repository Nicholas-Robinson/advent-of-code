import gleam/bool
import gleam/dict.{type Dict}
import gleam/int
import gleam/io
import gleam/iterator
import gleam/list
import gleam/string

pub fn part_one(input: String) -> String {
  let assert [instructions, raw_map] = input |> string.split("\n\n")
  let map = parse_map(raw_map)

  instructions
  |> string.split("")
  |> iterator.from_list
  |> iterator.cycle
  |> iterator.scan("AAA", fn(acc, step) {
    let assert Ok(#(l, r)) = dict.get(map, acc)

    case step {
      "L" -> l
      "R" -> r
      _ -> acc
    }
  })
  |> iterator.take_while(fn(step) { step != "ZZZ" })
  |> iterator.fold(1, fn(acc, _) { acc + 1 })
  |> int.to_string
}

fn parse_map(input: String) -> Dict(String, #(String, String)) {
  input
  |> string.split("\n")
  |> list.map(fn(line) {
    let assert [key, map] = line |> string.split(" = ")
    #(key, parse_branch(map))
  })
  |> dict.from_list
}

fn parse_branch(input: String) -> #(String, String) {
  #(
    input |> string.split("") |> list.drop(1) |> list.take(3) |> string.join(""),
    input |> string.split("") |> list.drop(6) |> list.take(3) |> string.join(""),
  )
}

pub fn part_two(input: String) -> String {
  let assert [instructions, raw_map] = input |> string.split("\n\n")
  let map = parse_map(raw_map)

  let start =
    map
    |> dict.keys
    |> list.filter(string.ends_with(_, "A"))

  instructions
  |> string.split("")
  |> iterator.from_list
  |> iterator.cycle
  |> iterator.scan(start, fn(current_location, step) {
    current_location
    |> list.filter_map(dict.get(map, _))
    |> list.map(fn(it) {
      case step {
        "L" -> it.0
        "R" -> it.1
        _ -> panic as "Unexpected step"
      }
    })
  })
  |> iterator.take_while(fn(steps) {
    steps |> list.all(string.ends_with(_, "Z")) |> bool.negate
  })
  |> iterator.fold(1, fn(acc, _) { acc + 1 })
  |> int.to_string
}
