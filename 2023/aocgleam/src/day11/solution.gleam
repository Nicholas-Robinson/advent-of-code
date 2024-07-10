import gleam/dict
import gleam/int
import gleam/io
import gleam/list
import gleam/pair
import gleam/result
import gleam/string

pub type Galaxy {
  Star
  Nothing(expanded: Bool)
}

pub fn part_one(input: String) -> String {
  input
  |> parse_map
  |> expand_vertically
  |> expand_horizontally
  |> to_coord_map
  |> list.combination_pairs
  |> list.map(to_distance_between)
  |> int.sum
  |> int.to_string
}

fn parse_map(input: String) -> List(List(Galaxy)) {
  input
  |> string.split("\n")
  |> list.map(parse_row)
}

fn parse_row(row: String) -> List(Galaxy) {
  row
  |> string.split("")
  |> list.map(parse_raw_cell)
}

fn parse_raw_cell(cell: String) -> Galaxy {
  case cell {
    "#" -> Star
    "." -> Nothing(False)
    _ -> panic as "Invalid cell"
  }
}

fn expand_vertically(map: List(List(Galaxy))) -> List(List(Galaxy)) {
  list.flat_map(map, fn(row) {
    case list.unique(row) {
      [Nothing(False)] -> [row, row |> list.map(fn(_) { Nothing(True) })]
      _ -> [row]
    }
  })
}

fn expand_horizontally(map: List(List(Galaxy))) -> List(List(Galaxy)) {
  let column_scan =
    list.fold(map, dict.new(), fn(acc, row) {
      list.index_fold(row, acc, fn(acc, cell, index) {
        case cell {
          Star -> dict.insert(acc, index, False)
          Nothing(_) ->
            case dict.has_key(acc, index) {
              False -> dict.insert(acc, index, True)
              True -> acc
            }
        }
      })
    })

  list.map(map, fn(row) {
    row
    |> list.index_map(fn(cell, index) {
      let assert Ok(expand) = dict.get(column_scan, index)
      case expand {
        True -> [cell, Nothing(True)]
        False -> [cell]
      }
    })
    |> list.flatten
  })
}

fn to_coord_map(map: List(List(Galaxy))) -> List(#(Int, Int)) {
  map
  |> list.index_map(fn(row, col) {
    row
    |> list.index_map(fn(cell, row) {
      case cell {
        Star -> [#(col, row)]
        Nothing(_) -> []
      }
    })
    |> list.flatten
  })
  |> list.flatten
}

fn to_distance_between(group: #(#(Int, Int), #(Int, Int))) -> Int {
  let #(a, b) = group
  let #(x1, y1) = a
  let #(x2, y2) = b

  int.absolute_value(x1 - x2) + int.absolute_value(y1 - y2)
}

fn get_offset_multiplier(
  group: #(#(Int, Int), #(Int, Int)),
  map: List(List(Galaxy)),
) -> Int {
  let #(a, b) = group
  let #(x1, y1) = a
  let #(x2, y2) = b

  io.debug("Group")
  io.debug(group)

  let block =
    map
    |> list.drop(int.min(x1, x2))
    |> list.take(int.absolute_value(x2 - x1) + 1)
    |> list.map(list.drop(_, int.min(y1, y2)))
    |> list.map(list.take(_, int.absolute_value(y2 - y1) + 1))
    |> list.map(io.debug)

  let vert =
    block
    |> list.filter_map(list.first)
    |> list.filter(is_expanse)
    |> list.length
    |> io.debug

  let horiz =
    block
    |> list.first
    |> result.unwrap([])
    |> list.filter(is_expanse)
    |> list.length
    |> io.debug

  io.debug(
    "VALUE: "
    <> int.to_string({ vert * offset } + { horiz * offset } - { vert + horiz }),
  )

  { vert * offset } + { horiz * offset } - { vert + horiz }
}

const offset = 10

fn is_expanse(cell: Galaxy) -> Bool {
  case cell {
    Nothing(True) -> True
    _ -> False
  }
}

pub fn part_two(input: String) -> String {
  let galaxy =
    input
    |> parse_map
    |> expand_vertically
    |> expand_horizontally
  // |> to_coord_map
  // |> list.combination_pairs
  // |> list.map(to_distance_between)
  // |> int.sum
  // |> int.to_string
  // |> io.debug

  let expanse_mulitiplier =
    galaxy
    |> to_coord_map
    |> list.combination_pairs
    |> list.map(get_offset_multiplier(_, galaxy))
    // |> list.map(to_distance_between)
    // |> int.sum
    // |> int.to_string
    |> io.debug

  galaxy
  |> to_coord_map
  |> list.combination_pairs
  |> list.map(to_distance_between)
  |> list.zip(expanse_mulitiplier)
  |> io.debug
  |> list.map(fn(group) { group.0 + group.1 })
  |> io.debug
  |> int.sum
  |> int.to_string
  |> io.debug

  "Working"
}
