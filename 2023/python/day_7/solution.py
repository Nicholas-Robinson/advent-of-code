from py_2023.utils import test_solutions, Test


############
# Part one #
############

def solution_part_one(lines):
    parts = [line.split(" ") for line in lines]
    hands = [(list(part[0]), int(part[1])) for part in parts]

    stuff = [
        (hand, bid, include_card_weight(hand, determine_type(hand) * 10000000000))
        for hand, bid in hands
    ]

    sorted_stuff = sorted(stuff, key=lambda t: t[2])

    output = 0
    for rank, tup in enumerate(sorted_stuff):
        bid = tup[1]
        output += bid * (1 + rank)

    return output


def determine_type(hand):
    cards_map = {}
    for card in hand:
        if card in cards_map:
            cards_map[card] += 1
        else:
            cards_map[card] = 1

    card_counts = cards_map.values()

    if 5 in card_counts:
        return 7
    elif 4 in card_counts:
        return 6
    elif 3 in card_counts and 2 in card_counts:
        return 5
    elif 3 in card_counts:
        return 4
    elif len([x for x in card_counts if x == 2]) == 2:
        return 3
    elif 2 in card_counts:
        return 2
    else:
        return 1


CARD_SCORE = list('23456789TJQKA')


def include_card_weight(hand, current_score):
    output = current_score
    for card_i, card in enumerate(list(hand)):
        card_score = CARD_SCORE.index(card) + 1
        offset = 100 ** (5 - card_i - 1)
        output += card_score * offset

    return output


############
# Part two #
############

def solution_part_two(lines):
    parts = [line.split(" ") for line in lines]
    hands = [(list(part[0]), int(part[1])) for part in parts]

    stuff = [
        (hand, bid, include_card_weight_2(hand, determine_type_2(hand) * 10000000000))
        for hand, bid in hands
    ]

    sorted_stuff = sorted(stuff, key=lambda t: t[2])

    output = 0
    for rank, tup in enumerate(sorted_stuff):
        bid = tup[1]
        output += bid * (1 + rank)

    return output


def determine_type_2(hand):
    cards_map = {}
    hand_wo_jokers = [c for c in hand if c != 'J']
    number_of_jokers = 5 - len(hand_wo_jokers)

    if number_of_jokers == 5:
        return 7

    for card in hand_wo_jokers:
        if card in cards_map:
            cards_map[card] += 1
        else:
            cards_map[card] = 1

    ordered_hand_values = sorted(cards_map.values())
    ordered_hand_values[-1] += number_of_jokers

    if 5 in ordered_hand_values:
        return 7
    elif 4 in ordered_hand_values:
        return 6
    elif 3 in ordered_hand_values and 2 in ordered_hand_values:
        return 5
    elif 3 in ordered_hand_values:
        return 4
    elif len([x for x in ordered_hand_values if x == 2]) == 2:
        return 3
    elif 2 in ordered_hand_values:
        return 2
    else:
        return 1


CARD_SCORE_2 = list('J23456789TQKA')


def include_card_weight_2(hand, current_score):
    output = current_score
    for card_i, card in enumerate(list(hand)):
        card_score = CARD_SCORE_2.index(card) + 1
        offset = 100 ** (5 - card_i - 1)
        output += card_score * offset

    return output


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
