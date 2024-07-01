import gleam/dict
import gleam/int
import gleam/io
import gleam/iterator.{type Iterator}
import gleam/list
import gleam/otp/task.{type Task}
import gleam/result
import gleam/string

type Seeds =
  List(Int)

type Range {
  Range(src: Int, dest: Int, length: Int)
}

pub fn part_one(input: String) {
  let assert Ok(answer) =
    input
    |> string.split("\n\n")
    |> parse
    |> list.reduce(int.min)

  int.to_string(answer)
}

fn parse(lines: List(String)) -> List(Int) {
  let assert [raw_seeds, ..rest] = lines
  let ranges = rest |> list.map(parse_range)

  raw_seeds
  |> parse_seeds
  |> list.map(list.fold(ranges, _, to_destination))
}

fn parse_seeds(raw_seeds: String) -> Seeds {
  let assert "seeds: " <> seeds = raw_seeds

  seeds
  |> string.split(" ")
  |> list.map(string.trim)
  |> list.map(int.parse)
  |> list.map(result.unwrap(_, 0))
}

fn parse_range(line: String) -> List(Range) {
  let assert [_, ..rest] = string.split(line, ":")

  rest
  |> list.map(string.trim)
  |> list.map(string.split(_, "\n"))
  |> list.flatten
  |> list.map(fn(line) {
    let assert [dest, src, length] =
      line
      |> string.split(" ")
      |> list.map(string.trim)
      |> list.map(int.parse)
      |> list.map(result.unwrap(_, 0))

    Range(src, dest, length)
  })
}

fn in_range(range: Range, value: Int) -> Bool {
  value == int.clamp(value, range.src, range.src + range.length)
}

fn to_destination(value: Int, ranges: List(Range)) -> Int {
  let range = list.find(ranges, in_range(_, value))

  case range {
    Ok(range) -> range.dest + { value - range.src }
    Error(_) -> value
  }
}

pub fn part_two(input: String) {
  input
  |> string.split("\n\n")
  |> parse_2
  |> int.to_string
}

fn parse_2(lines: List(String)) -> Int {
  let assert [raw_seeds, ..rest] = lines
  let ranges = rest |> list.map(parse_range)

  ranges
  |> list.fold(dict.new(), fn(acc, ranges) {
    io.debug(ranges)
    acc
  })

  // let assert Ok(answer) =
  raw_seeds
  |> parse_seeds
  |> list.sized_chunk(2)

  // |> list.map(fn(seeds) {
  //   let assert [from, to] = seeds
  //   iterator.range(from, from + to)
  // })
  // |> list.map(process_async(_, ranges))
  // |> list.map(task.await_forever)
  // |> list.reduce(int.min)
  // |> io.debug

  0
}

fn process_async(iter: Iterator(Int), ranges: List(List(Range))) -> Task(Int) {
  task.async(fn() {
    let assert Ok(answer) =
      iter
      |> iterator.index
      |> iterator.map(fn(it) {
        let #(seed, i) = it

        case i % 100_000 {
          0 -> io.debug(i)
          _ -> i
        }

        list.fold(ranges, seed, to_destination)
      })
      |> iterator.reduce(int.min)

    io.debug(answer)

    answer
  })
}
