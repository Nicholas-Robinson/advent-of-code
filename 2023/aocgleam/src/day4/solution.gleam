import gleam/dict
import gleam/int
import gleam/list
import gleam/result
import gleam/string

pub type Game {
  Game(card_number: Int, win_list: List(Int), played_list: List(Int))
}

pub fn part_one(input: String) {
  input
  |> string.split("\n")
  |> list.map(parse_card)
  |> list.map(compute_game_score_count)
  |> list.map(int.subtract(_, 1))
  |> list.map(int_raise_two)
  |> int.sum
  |> int.to_string
}

fn parse_card(input: String) -> Game {
  let assert ["Card " <> card_number, card] = string.split(input, ": ")
  let assert [win_list, played_list] = string.split(card, " | ")

  Game(
    card_number: int.parse(card_number) |> result.unwrap(0),
    win_list: parse_card_numbers(win_list),
    played_list: parse_card_numbers(played_list),
  )
}

fn parse_card_numbers(input: String) -> List(Int) {
  input
  |> string.split(" ")
  |> list.map(string.trim)
  |> list.filter_map(int.parse)
}

fn compute_game_score_count(game: Game) -> Int {
  let Game(_, win_list, played_list) = game

  played_list
  |> list.filter(list.contains(win_list, _))
  |> list.length
}

fn int_raise_two(exp: Int) -> Int {
  case exp {
    -1 -> 0
    0 -> 1
    _ -> 2 * int_raise_two(exp - 1)
  }
}

pub fn part_two(input: String) {
  let games =
    input
    |> string.split("\n")
    |> list.map(parse_card)

  let lookup =
    games
    |> list.map(fn(game) {
      let win =
        games
        |> list.drop_while(fn(g) { g != game })
        |> list.drop(1)
        |> list.take(compute_game_score_count(game))

      #(game, win)
    })
    |> dict.from_list

  games
  |> loop(lookup, 0)
  |> int.to_string
}

fn loop(games: List(Game), lookup: dict.Dict(Game, List(Game)), acc: Int) {
  case games {
    [game, ..rest] -> {
      let assert Ok(win) = dict.get(lookup, game)
      win
      |> loop(lookup, acc + 1)
      |> loop(rest, lookup, _)
    }
    [] -> acc
  }
}
