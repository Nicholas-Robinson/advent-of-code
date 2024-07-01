import day3/solution_lexer.{type Lex, Char, NewLine, Nothing, Number}
import gleam/int
import gleam/list
import gleam/result

pub type AST {
  PartNumber(n: Int, from: Int, to: Int, line: Int)
  PartIcon(icon: String, i: Int, line: Int)
}

pub fn parse(input: List(Lex)) -> Result(List(AST), Nil) {
  run_parser(input, [])
}

fn run_parser(input: List(Lex), parsed: List(AST)) -> Result(List(AST), Nil) {
  case input {
    [_, ..] -> {
      parse_part_number(input)
      |> result.try_recover(parse_part_icon)
      |> result.try_recover(parse_nothing)
      |> result.nil_error
      |> result.try(fn(result) {
        run_parser(result.1, list.append(parsed, result.0))
      })
    }

    [] -> Ok(parsed)
  }
}

fn parse_part_number(
  input: List(Lex),
) -> Result(#(List(AST), List(Lex)), List(Lex)) {
  let numbers = list.take_while(input, solution_lexer.is_number)

  let ast = case input {
    [Number(_, _, line), ..] -> {
      let assert Ok(value) =
        numbers
        |> list.map(solution_lexer.number_value)
        |> int.undigits(10)

      let #(from, to) =
        list.fold(numbers, #(999_999, 0), fn(acc, n) {
          let #(from, to) = acc
          case n {
            Number(_, r, _) -> #(int.min(from, r), int.max(to, r))
            _ -> acc
          }
        })

      Ok(PartNumber(value, from, to, line))
    }

    _ -> Error(input)
  }

  result.map(ast, fn(ast) { #([ast], list.drop(input, list.length(numbers))) })
}

fn parse_part_icon(
  input: List(Lex),
) -> Result(#(List(AST), List(Lex)), List(Lex)) {
  case input {
    [Char(icon, i, line), ..] -> {
      let remaining = list.rest(input) |> result.unwrap([])
      Ok(#([PartIcon(icon, i, line)], remaining))
    }

    _ -> Error(input)
  }
}

fn parse_nothing(input: List(Lex)) -> Result(#(List(AST), List(Lex)), List(Lex)) {
  case input {
    [Nothing(_, _), ..] | [NewLine(_, _), ..] -> {
      Ok(#([], list.drop(input, 1)))
    }

    _ -> Error(input)
  }
}

pub fn is_part_number(ast: AST) -> Bool {
  case ast {
    PartNumber(_, _, _, _) -> True
    _ -> False
  }
}

pub fn is_part_icon(ast: AST) -> Bool {
  case ast {
    PartIcon(_, _, _) -> True
    _ -> False
  }
}
