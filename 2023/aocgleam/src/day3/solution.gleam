import day3/solution_lexer as lexer
import day3/solution_parser.{PartIcon, PartNumber} as parser
import gleam/bool
import gleam/int
import gleam/list
import gleam/pair
import gleam/result
import gleam/string

pub fn part_one(input: String) {
  let chars = input |> string.split("")

  let line_length =
    chars
    |> list.take_while(fn(c) { c != "\n" })
    |> list.length()

  let assert Ok(parsed) =
    lexer.lex(chars, line_length + 1)
    |> result.nil_error
    |> result.try(parser.parse)

  let part_icon_lookup =
    parsed
    |> list.filter(parser.is_part_icon)
    |> list.fold([], fn(acc, part_icon) {
      let assert PartIcon(_, i, line) = part_icon
      list.prepend(acc, #(i, line))
    })

  parsed
  |> list.filter(parser.is_part_number)
  |> list.filter(fn(part_number) {
    let assert PartNumber(_, from, to, line) = part_number
    list.range(line - 1, line + 1)
    |> list.map(fn(line) {
      list.range(from - 1, to + 1)
      |> list.map(fn(i) { #(i, line) })
    })
    |> list.flatten
    |> list.filter(list.contains(part_icon_lookup, _))
    |> list.is_empty
    |> bool.negate
  })
  |> list.map(fn(part_number) {
    let assert PartNumber(n, _, _, _) = part_number
    n
  })
  |> int.sum
  |> int.to_string
}

pub fn part_two(input: String) {
  let chars = input |> string.split("")

  let line_length =
    chars
    |> list.take_while(fn(c) { c != "\n" })
    |> list.length()

  let assert Ok(parsed) =
    lexer.lex(chars, line_length + 1)
    |> result.nil_error
    |> result.try(parser.parse)

  let part_icon_lookup =
    parsed
    |> list.filter(parser.is_part_icon)
    |> list.fold([], fn(acc, part_icon) {
      case part_icon {
        PartIcon("*", i, line) -> list.prepend(acc, #(i, line))
        _ -> acc
      }
    })

  let connected_parts =
    parsed
    |> list.filter(parser.is_part_number)
    |> list.filter_map(fn(part_number) {
      let assert PartNumber(_, from, to, line) = part_number

      let indices =
        list.range(line - 1, line + 1)
        |> list.map(fn(line) {
          list.range(from - 1, to + 1)
          |> list.map(fn(i) { #(i, line) })
        })
        |> list.flatten
        |> list.filter_map(fn(index) {
          case list.contains(part_icon_lookup, index) {
            True -> Ok(#(index, part_number))
            False -> Error(Nil)
          }
        })

      case list.is_empty(indices) {
        True -> Error(Nil)
        False -> Ok(indices)
      }
    })
    |> list.flatten

  part_icon_lookup
  |> list.filter_map(fn(icon) {
    let filter =
      connected_parts
      |> list.filter(fn(it) { pair.first(it) == icon })
      |> list.map(pair.second)

    case filter {
      [PartNumber(x, _, _, _), PartNumber(y, _, _, _)] -> Ok(x * y)
      _ -> Error(Nil)
    }
  })
  |> int.sum
  |> int.to_string
}
