import gleam/int
import gleam/io
import gleam/list
import gleam/string

type MapItems {
  Operational
  Damaged
}

pub fn part_one(input: String) -> String {
  input
  |> string.trim
  |> string.split("\n")
  |> list.map(parse_line)
  |> list.map(filter_options_by_countes)
  |> list.map(list.length)
  |> list.map(io.debug)

  "This is working"
}

fn filter_options_by_countes(
  group: #(List(Int), List(List(MapItems))),
) -> List(List(MapItems)) {
  let #(counts, map) = group

  list.filter(map, test_case(_, counts))
}

fn test_case(map: List(MapItems), counts: List(Int)) -> Bool {
  counts == map |> group_map_items
}

fn group_map_items(map_line: List(MapItems)) -> List(Int) {
  case map_line {
    [first, ..rest] -> {
      let run =
        rest
        |> list.take_while(fn(x) { x == first })
        |> list.prepend(first)
        |> list.length

      let remaining = rest |> list.drop(run)

      [run, ..group_map_items(remaining)]
    }
    [] -> []
  }
}

fn parse_line(line: String) {
  let assert [raw_map, raw_counts] = line |> string.split(" ")

  let countes = raw_counts |> parse_counts

  let map =
    raw_map
    |> string.split("")
    |> parse_map

  #(countes, map)
}

fn parse_counts(raw_count: String) -> List(Int) {
  raw_count
  |> string.split(",")
  |> list.filter_map(int.parse)
}

fn parse_map(raw_map: List(String)) -> List(List(MapItems)) {
  case raw_map {
    ["?", ..rest] -> {
      let a = parse_map(rest)

      let b = list.map(a, list.prepend(_, Operational))
      let c = list.map(a, list.prepend(_, Damaged))

      list.concat([b, c])
    }
    [".", ..rest] -> list.map(parse_map(rest), list.prepend(_, Operational))
    ["#", ..rest] -> list.map(parse_map(rest), list.prepend(_, Damaged))
    _ -> [[]]
  }
}

pub fn part_two(input: String) -> String {
  todo
}
