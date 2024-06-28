import gleam/int
import gleam/list
import gleam/string

type Game {
  Game(id: Int, r: Int, g: Int, b: Int)
}

pub fn part_one(input: String) {
  input
  |> string.split("\n")
  |> list.map(extract_game)
  |> list.filter_map(fn(game) {
    let can_red = game.r <= 12
    let can_green = game.g <= 13
    let can_blue = game.b <= 14

    case can_red, can_green, can_blue {
      True, True, True -> Ok(game.id)
      _, _, _ -> Error(Nil)
    }
  })
  |> int.sum
  |> int.to_string
}

fn extract_game(line: String) -> Game {
  let assert ["Game " <> id, details] = string.split(line, ":")
  let assert Ok(id) = int.parse(id)

  details
  |> string.trim
  |> string.split(";")
  |> list.fold(Game(id, 0, 0, 0), apply_hand)
}

fn apply_hand(game: Game, hand: String) -> Game {
  hand
  |> string.split(";")
  |> list.flat_map(string.split(_, ","))
  |> list.map(string.trim)
  |> list.fold(game, apply_colour)
}

fn apply_colour(game: Game, colour: String) -> Game {
  let assert [count, colour] = string.split(colour, " ")
  let assert Ok(count) = int.parse(count)

  case string.trim(colour) {
    "red" -> Game(..game, r: int.max(game.r, count))
    "green" -> Game(..game, g: int.max(game.g, count))
    "blue" -> Game(..game, b: int.max(game.b, count))
    _ -> game
  }
}

pub fn part_two(input: String) {
  input
  |> string.split("\n")
  |> list.map(extract_game)
  |> list.map(fn(game) { game.r * game.g * game.b })
  |> int.sum
  |> int.to_string
}
