import gleam/function
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import gleam/string
import gleam/yielder

pub fn part_one(input: String) {
  let parsed = parse(input) |> yielder.from_list

  yielder.repeat(0)
  |> yielder.scan(parsed, fn(l, _) { l |> yielder.flat_map(apply_rules) })
  |> yielder.take(10)
  |> yielder.map(tap_log)
  |> yielder.last()
  |> result.unwrap(yielder.empty())
  |> yielder.length
  |> int.to_string
}

fn tap_log(a: yielder.Yielder(Int)) -> yielder.Yielder(Int) {
//  io.println("-----------")
  let b = a |> yielder.to_list |> list.map(int.to_string)
  b |> list.length |> io.debug
  b |> string.join(", ") |> io.debug
  a
}

pub fn part_two(input: String) {
  let parsed = parse(input) |> yielder.from_list

  yielder.repeat(0)
  |> yielder.scan(parsed, fn(l, _) { l |> yielder.flat_map(apply_rules) })
  |> yielder.take(75)
  |> yielder.last()
  |> result.unwrap(yielder.empty())
  |> yielder.length
  |> int.to_string
}

fn parse(input: String) -> List(Int) {
  input
  |> string.split(" ")
  |> list.map(int.parse)
  |> list.filter_map(function.identity)
}

fn apply_rules(stone: Int) -> yielder.Yielder(Int) {
  stone
  |> zero_rule
  |> result.try_recover(even_str_rule)
  |> result.lazy_unwrap(fn() { default_rule(stone) })
}

fn zero_rule(stone: Int) -> Result(yielder.Yielder(Int), Int) {
  case stone {
    0 -> Ok([1] |> yielder.from_list)
    _ -> Error(stone)
  }
}

fn even_str_rule(stone: Int) -> Result(yielder.Yielder(Int), Int) {
  int.digits(stone, 10)
  |> result.try(fn(digits) {
    let len = list.length(digits)
    case len % 2 {
      0 -> {
        let half_length = len / 2

        result.all([
          digits |> list.take(half_length) |> int.undigits(10),
          digits |> list.drop(half_length) |> int.undigits(10),
        ])
        |> result.map(yielder.from_list)
      }
      _ -> Error(Nil)
    }
  })
  |> result.map_error(fn(_) { stone })
}

fn default_rule(stone: Int) -> yielder.Yielder(Int) {
  [stone * 2024] |> yielder.from_list
}
