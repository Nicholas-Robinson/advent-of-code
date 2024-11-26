import argv
import day1/solution as day1
import day10/solution as day10
import day11/solution as day11
import day12/solution as day12
import day2/solution as day2
import day3/solution as day3
import day4/solution as day4
import day5/solution as day5
import day6/solution as day6
import day7/solution as day7
import day8/solution as day8
import day9/solution as day9
import gleam/dict.{type Dict}
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import simplifile

pub fn main() {
  let solutions =
    dict.from_list([
      build_day(1, day1.part_one, day1.part_two),
      build_day(2, day2.part_one, day2.part_two),
      build_day(3, day3.part_one, day3.part_two),
      build_day(4, day4.part_one, day4.part_two),
      build_day(5, day5.part_one, day5.part_two),
      build_day(6, day6.part_one, day6.part_two),
      build_day(7, day7.part_one, day7.part_two),
      build_day(8, day8.part_one, day8.part_two),
      build_day(9, day9.part_one, day9.part_two),
      build_day(10, day10.part_one, day10.part_two),
      build_day(11, day11.part_one, day11.part_two),
      build_day(12, day12.part_one, day12.part_two),
    ])

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
