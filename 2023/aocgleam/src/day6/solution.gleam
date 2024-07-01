import gleam/int
import gleam/list
import gleam/string

pub fn part_one(input: String) -> String {
  parse(input)
  |> list.map(simulate)
  |> list.fold(1, int.multiply)
  |> int.to_string
}

fn parse(input: String) -> List(#(Int, Int)) {
  let assert [times, distences] =
    input
    |> string.split("\n")
    |> list.map(parse_line)

  list.zip(times, distences)
}

fn parse_line(line: String) -> List(Int) {
  string.split(line, ":")
  |> list.map(string.trim)
  |> list.map(string.split(_, " "))
  |> list.drop(1)
  |> list.flatten
  |> list.filter_map(int.parse)
}

fn simulate(race: #(Int, Int)) -> Int {
  list.range(from: 0, to: race.0)
  |> list.map(fn(t) { t * { race.0 - t } })
  |> list.filter(fn(travel) { travel > race.1 })
  |> list.length
}

pub fn part_two(input: String) -> String {
  let assert [time, distance] =
    input
    |> string.split("\n")
    |> list.map(parse_line)
    |> list.map(fn(ns) { list.filter_map(ns, int.digits(_, 10)) })
    |> list.map(list.flatten)
    |> list.filter_map(int.undigits(_, 10))

  #(time, distance)
  |> simulate
  |> int.to_string
}
