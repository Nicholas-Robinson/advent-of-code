import gleam/int
import gleam/io
import gleam/list
import gleam/result
import gleam/string

pub fn part_one(input: String) -> String {
  input
  |> string.split("\n")
  |> list.map(fn(line) {
    line
    |> string.split(" ")
    |> list.filter_map(int.parse)
    |> extrapolate_line
  })
  |> int.sum
  |> int.to_string
}

fn extrapolate_line(line: List(Int)) -> Int {
  case list.unique(line) {
    [a] -> a
    _ -> {
      let assert Ok(last) = line |> list.reverse |> list.first

      line
      |> list.zip(list.drop(line, 1))
      |> list.map(pair_sub)
      |> extrapolate_line
      |> int.add(last)
    }
  }
}

fn pair_sub(tuple: #(Int, Int)) -> Int {
  tuple.1 - tuple.0
}

pub fn part_two(input: String) -> String {
  input
  |> string.split("\n")
  |> list.map(fn(line) {
    line
    |> string.split(" ")
    |> list.filter_map(int.parse)
    |> extrapolate_line_backwards
  })
  |> int.sum
  |> int.to_string
}

fn extrapolate_line_backwards(line: List(Int)) -> Int {
  case list.unique(line) {
    [a] -> a
    _ -> {
      let assert Ok(first) = line |> list.first

      line
      |> list.zip(list.drop(line, 1))
      |> list.map(pair_sub)
      |> extrapolate_line_backwards
      |> fn(n) { first - n }
    }
  }
}
