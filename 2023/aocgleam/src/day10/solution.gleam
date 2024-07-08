import gleam/dict.{type Dict}
import gleam/int
import gleam/io
import gleam/iterator
import gleam/list
import gleam/pair
import gleam/result
import gleam/set.{type Set}
import gleam/string

pub type Tile {
  Vertical
  Horizontal
  UpLeft
  UpRight
  DownLeft
  DownRight
  Ground
  Start
}

pub type Coord =
  #(Int, Int)

pub type Fix {
  Up(coord: Coord)
  Down(coord: Coord)
  Left(coord: Coord)
  Right(coord: Coord)
  Finish(coord: Coord)
}

pub fn part_one(input: String) -> String {
  let map = parse_map(input)

  map
  |> dict.to_list
  |> list.find(fn(tile) { tile.1 == Start })
  |> result.map(pair.first)
  |> result.map(fn(start) {
    [
      Up(#(start.0 - 1, start.1)),
      Down(#(start.0 + 1, start.1)),
      Left(#(start.0, start.1 - 1)),
      Right(#(start.0, start.1 + 1)),
    ]
  })
  |> result.map(list.filter_map(_, fn(fix) { walk([fix], map, set.new()) }))
  |> result.map(list.first)
  |> result.flatten()
  |> result.map(list.length)
  |> result.try(int.divide(_, 2))
  |> result.unwrap(0)
  |> int.to_string
}

fn walk(
  path: List(Fix),
  map: Dict(Coord, Tile),
  visited: Set(Coord),
) -> Result(List(Fix), Nil) {
  let assert [fix, ..] = path

  case fix, set.contains(visited, fix.coord) {
    Finish(_), _ -> Ok(path)
    _, True -> Error(Nil)
    _, False -> {
      map
      |> dict.get(fix.coord)
      |> result.try(next_fix(fix, _))
      |> result.map(list.prepend(path, _))
      |> result.try(walk(_, map, set.insert(visited, fix.coord)))
    }
  }
}

fn next_fix(fix: Fix, current_tile: Tile) -> Result(Fix, Nil) {
  case fix, current_tile {
    _, Start -> Ok(Finish(fix.coord))

    Up(coord), Vertical -> Ok(Up(move(coord, -1, 0)))
    Up(coord), UpRight -> Ok(Right(move(coord, 0, 1)))
    Up(coord), UpLeft -> Ok(Left(move(coord, 0, -1)))

    Down(coord), Vertical -> Ok(Down(move(coord, 1, 0)))
    Down(coord), DownRight -> Ok(Right(move(coord, 0, 1)))
    Down(coord), DownLeft -> Ok(Left(move(coord, 0, -1)))

    Left(coord), Horizontal -> Ok(Left(move(coord, 0, -1)))
    Left(coord), UpRight -> Ok(Down(move(coord, 1, 0)))
    Left(coord), DownRight -> Ok(Up(move(coord, -1, 0)))

    Right(coord), Horizontal -> Ok(Right(move(coord, 0, 1)))
    Right(coord), UpLeft -> Ok(Down(move(coord, 1, 0)))
    Right(coord), DownLeft -> Ok(Up(move(coord, -1, 0)))

    _, _ -> Error(Nil)
  }
}

fn move(coord: Coord, x_offset: Int, y_offset: Int) -> Coord {
  #(coord.0 + x_offset, coord.1 + y_offset)
}

fn parse_map(input: String) -> Dict(Coord, Tile) {
  input
  |> string.split("\n")
  |> list.index_map(parse_line)
  |> list.flatten
  |> dict.from_list
}

fn parse_line(line: String, col: Int) -> List(#(Coord, Tile)) {
  line
  |> string.split("")
  |> list.index_map(fn(tile, i) { #(#(col, i), parse_tile(tile)) })
}

fn parse_tile(c: String) -> Tile {
  case c {
    "." -> Ground
    "|" -> Vertical
    "-" -> Horizontal
    "L" -> DownRight
    "J" -> DownLeft
    "F" -> UpRight
    "7" -> UpLeft
    "S" -> Start
    _ -> panic as "Invalid tile"
  }
}

type Situation {
  Outside
  Inside
}

type Other {
  Dot(sit: Situation)
  Vert(sit: Situation)
  UpCorner(sit: Situation)
  DownCorner(sit: Situation)
}

pub fn part_two(input: String) -> String {
  input
  |> string.split("\n\n")
  |> list.map(string.split(_, "\n"))
  |> list.map(parst_map_situations)
  |> list.map(list.flatten)
  |> list.map(list.length)
  |> io.debug

  "Working on it"
}

fn parst_map_situations(lines: List(String)) {
  lines
  |> list.map(string.split(_, ""))
  |> list.map(parse_situation)
  |> list.zip(lines |> list.map(string.split(_, "")))
  |> list.map(fn(it) {
    let #(a, b) = it
    list.zip(a, b)
    |> list.filter_map(fn(tup) {
      case tup.1, tup.0 {
        ".", Dot(Inside) -> Ok(".")
        _, _ -> Error(Nil)
      }
    })
  })
}

fn parse_situation(lines: List(String)) {
  let assert [first, ..] = lines

  lines
  |> list.scan(first_situation(first), fn(situation, line) {
    case line, situation {
      ".", _ -> Dot(situation.sit)

      "7", UpCorner(sit) -> DownCorner(flip(sit))
      "7", _ -> DownCorner(situation.sit)

      "J", DownCorner(sit) -> UpCorner(flip(sit))
      "J", _ -> UpCorner(situation.sit)

      "F", UpCorner(sit) -> DownCorner(flip(sit))
      "F", _ -> DownCorner(situation.sit)

      "L", DownCorner(sit) -> UpCorner(flip(sit))
      "L", _ -> UpCorner(situation.sit)

      "|", _ -> Vert(flip(situation.sit))

      _, _ -> situation
    }
  })
}

fn first_situation(char: String) -> Other {
  case char {
    "." -> Dot(Outside)
    "7" -> UpCorner(Outside)
    "J" -> DownCorner(Outside)
    "F" -> UpCorner(Outside)
    "L" -> DownCorner(Outside)
    "|" -> Vert(Outside)
    _ -> panic as "Invalid char"
  }
}

fn flip(sit: Situation) -> Situation {
  case sit {
    Inside -> Outside
    Outside -> Inside
  }
}
