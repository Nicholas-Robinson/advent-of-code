import argv
import day1/solution as day1
import gleam/dict.{type Dict}
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import simplifile

pub fn main() {
  let solutions = dict.from_list([build_day(1, day1.part_one, day1.part_two)])
  let assert [day, solution] = argv.load().arguments

  use day_solutions <- result.try(dict.get(solutions, day))
  use solution_fn <- result.try(dict.get(day_solutions, solution))

  ["sample", "input"]
  |> list.map(fn(sufix) {
    sufix
    |> build_file_path(day, solution)
    |> simplifile.read
    |> result.map(solution_fn)
    |> result.unwrap(or: "NO SOLUTION")
    |> fn(output) { io.println("Output " <> sufix <> ": " <> output) }
  })

  Ok(Nil)
}

fn build_file_path(sufix: String, day: String, part: String) -> String {
  "./src/day" <> day <> "/part_" <> part <> "_" <> sufix <> ".txt"
}

type Solution =
  fn(String) -> String

fn build_day(
  day: Int,
  part_one: Solution,
  part_two: Solution,
) -> #(String, Dict(String, Solution)) {
  #(int.to_string(day), dict.from_list([#("1", part_one), #("2", part_two)]))
}
