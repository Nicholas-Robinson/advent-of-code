import collections

from py_2023.utils import test_solutions, Test


############
# Part one #
############

def solution_part_one(lines):
    return sum([
        2 ** (len(win_set.intersection(play_set)) - 1)
        for line in lines
        for [win_set, play_set] in [read_card(line)]
        for inter in [win_set.intersection(play_set)]
        if len(inter) > 0
    ])


def read_card(line):
    card_line = line.split(": ")[-1]
    winning, play = card_line.replace("  ", " ").strip().split(" | ")

    winning_numbers = [int(number) for number in winning.split(" ")]
    play_numbers = [int(number) for number in play.split(" ")]

    return [set(winning_numbers), set(play_numbers)]


############
# Part two #
############

class Card:
    def __init__(self, number_of_winning_numbers):
        self.number_of_winning_numbers = number_of_winning_numbers
        self.instance_count = 1
        self.cards_won = []


def solution_part_two(lines):
    initial_cards = [
        Card(len(inter))
        for line in lines
        for [win_set, play_set] in [read_card(line)]
        for inter in [win_set.intersection(play_set)]
    ]

    for i, card in enumerate(initial_cards):
        card.cards_won = initial_cards[i + 1:i + card.number_of_winning_numbers + 1]

    processing_queue = collections.deque(initial_cards)
    while len(processing_queue) != 0:
        process_item = processing_queue.popleft()
        for win in process_item.cards_won:
            win.instance_count += 1
            processing_queue.append(win)

    return sum([card.instance_count for card in initial_cards])


################
# Calling code #
################

TEST_PART_ONE_FILE = "test_1"
FINAL_PART_ONE_FILE = "input_1"

TEST_PART_TWO_FILE = "test_1"
FINAL_PART_TWO_FILE = "input_1"

test_solutions([
    # Part one
    Test(solution_part_one)
    .with_test_input(TEST_PART_ONE_FILE)
    .with_final_input(FINAL_PART_ONE_FILE),

    # Part two
    Test(solution_part_two)
    .with_test_input(TEST_PART_TWO_FILE)
    .with_final_input(FINAL_PART_TWO_FILE)
])
