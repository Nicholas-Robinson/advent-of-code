import argv
import day11/solution as day11
import day6/solution as day6
import gleam/dict.{type Dict}
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import simplifile

pub fn main() {
  let solutions =
    dict.from_list([
      build_day(6, day6.part_one, day6.part_two),
      build_day(11, day11.part_one, day11.part_two),
    ])

  let assert [day, solution] = argv.load().arguments

  use day_solutions <- result.try(dict.get(solutions, day))
  use solution_fn <- result.try(dict.get(day_solutions, solution))

  io.debug("Running day " <> day <> " solution " <> solution)
  //  io.debug(day_solutions)
  //  io.debug(solution_fn)

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
