import gleam/dict
import gleam/function
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import gleam/string

pub type Rank {
  FiveOfAKind
  FourOfAKind
  FullHouse
  ThreeOfAKind
  TwoPairs
  OnePair
  HighCard
}

pub type Hand {
  Hand(cards: List(String), rank: Rank, bet: Int)
}

pub fn part_one(input: String) -> String {
  input
  |> string.split("\n")
  |> list.map(parse_line)
  |> list.sort(fn(a, b) {
    int.compare(hand_strength(a.cards), hand_strength(b.cards))
  })
  |> list.reverse
  |> list.sort(fn(a, b) { int.compare(rang_order(b.rank), rang_order(a.rank)) })
  |> list.reverse
  |> list.index_map(fn(hand, i) { { i + 1 } * hand.bet })
  |> int.sum
  |> int.to_string
}

fn parse_line(line: String) -> Hand {
  let assert [raw_cards, raw_bet] =
    string.split(line, " ")
    |> list.map(string.trim)

  let assert Ok(bet) = int.parse(raw_bet)

  raw_cards
  |> string.split("")
  |> fn(hand) { Hand(hand, compute_rank(hand), bet) }
}

fn compute_rank(cards: List(String)) -> Rank {
  let jokers = cards |> list.filter(fn(card) { card == "J" })
  let others = cards |> list.filter(fn(card) { card != "J" })

  let counts =
    others
    |> list.group(function.identity)
    |> dict.values
    |> list.map(list.length)
    |> list.sort(int.compare)
    |> list.reverse

  let result = case counts {
    [h, ..t] -> [h + list.length(jokers), ..t]
    _ -> [list.length(jokers)]
  }

  case result {
    [5] -> FiveOfAKind
    [4, 1] -> FourOfAKind
    [3, 2] -> FullHouse
    [3, 1, 1] -> ThreeOfAKind
    [2, 2, 1] -> TwoPairs
    [2, 1, 1, 1] -> OnePair
    _ -> HighCard
  }
}

fn hand_strength(hand: List(String)) -> Int {
  hand
  |> list.flat_map(card_strength)
  |> int.undigits(10)
  |> result.unwrap(0)
}

fn card_strength(card: String) -> List(Int) {
  case card {
    "A" -> [1, 4]
    "K" -> [1, 3]
    "Q" -> [1, 2]
    "J" -> [0, 0]
    "T" -> [1, 0]
    _ -> [0, card |> int.parse |> result.unwrap(0)]
  }
}

fn rang_order(rank: Rank) -> Int {
  case rank {
    FiveOfAKind -> 8
    FourOfAKind -> 7
    FullHouse -> 6
    ThreeOfAKind -> 5
    TwoPairs -> 4
    OnePair -> 3
    HighCard -> 2
  }
}

pub fn part_two(input: String) -> String {
  input
  |> string.split("\n")
  |> list.map(parse_line)
  |> list.sort(fn(a, b) {
    int.compare(hand_strength(a.cards), hand_strength(b.cards))
  })
  |> list.reverse
  |> list.sort(fn(a, b) { int.compare(rang_order(b.rank), rang_order(a.rank)) })
  |> list.reverse
  |> list.index_map(fn(hand, i) { { i + 1 } * hand.bet })
  |> int.sum
  |> int.to_string
}
