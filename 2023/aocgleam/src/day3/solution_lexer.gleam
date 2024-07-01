import gleam/int
import gleam/list
import gleam/result

pub type Lex {
  Number(n: Int, row: Int, col: Int)
  Char(c: String, row: Int, col: Int)
  Nothing(row: Int, col: Int)
  NewLine(row: Int, col: Int)
}

pub opaque type LexContext {
  LexContext(char: String, index: Int, line_len: Int)
}

pub fn lex(raw: List(String), line_len: Int) -> Result(List(Lex), LexContext) {
  raw
  |> list.index_map(fn(c, i) { LexContext(c, i, line_len) })
  |> list.map(lex_number)
  |> list.map(result.try_recover(_, lex_char))
  |> list.map(result.try_recover(_, lex_nothing))
  |> list.map(result.try_recover(_, lex_new_line))
  |> result.all
}

fn lex_number(context: LexContext) -> Result(Lex, LexContext) {
  let LexContext(char, index, line_len) = context

  char
  |> int.parse
  |> result.map(Number(_, index % line_len, index / line_len))
  |> result.map_error(fn(_) { context })
}

fn lex_char(context: LexContext) -> Result(Lex, LexContext) {
  let LexContext(char, index, line_len) = context

  case char {
    "\n" | "." | "" -> Error(context)
    c -> Ok(Char(c, index % line_len, index / line_len))
  }
}

fn lex_nothing(context: LexContext) -> Result(Lex, LexContext) {
  let LexContext(char, index, line_len) = context

  case char {
    "." -> Ok(Nothing(index % line_len, index / line_len))
    _ -> Error(context)
  }
}

fn lex_new_line(context: LexContext) -> Result(Lex, LexContext) {
  let LexContext(char, index, line_len) = context

  case char {
    "\n" -> Ok(NewLine(index % line_len, index / line_len))
    _ -> Error(context)
  }
}

pub fn is_number(lex: Lex) -> Bool {
  case lex {
    Number(_, _, _) -> True
    _ -> False
  }
}

pub fn number_value(lex: Lex) -> Int {
  let assert Number(n, _, _) = lex
  n
}
