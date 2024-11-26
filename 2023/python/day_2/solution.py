from py_2023.utils import read_all_lines_from_input


############
# Part one #
############

def solution_part_one(lines):
    return sum([
        get_game_id(line) for
        line in lines
        if is_game_valid(line, 12, 13, 14)
    ])


def is_game_valid(game_line, req_red, req_green, req_blue):
    game_rounds = game_line.split(": ")[-1]

    for round_str in game_rounds.split("; "):
        for colour_str in round_str.split(", "):
            count, colour = colour_str.split(" ")
            if colour == "red" and int(count) > req_red:
                return False
            elif colour == "green" and int(count) > req_green:
                return False
            elif colour == "blue" and int(count) > req_blue:
                return False

    return True


def get_game_id(game_line):
    game_name = game_line.split(": ")[0]
    game_id_str = game_name.replace("Game ", "")
    return int(game_id_str)


############
# Part two #
############

def solution_part_two(lines):
    powers = []

    for line in lines:
        r, g, b = get_min_game(line)
        powers.append(r * g * b)

    return sum(powers)


def get_min_game(game_line):
    game_rounds = game_line.split(": ")[-1]
    r, g, b = 0, 0, 0

    for round_str in game_rounds.split("; "):
        for colour_str in round_str.split(", "):
            count, colour = colour_str.split(" ")
            if colour == "red":
                r = max(r, int(count))
            elif colour == "green":
                g = max(g, int(count))
            elif colour == "blue":
                b = max(b, int(count))

    return r, b, g


################
# Calling code #
################

part_one_test_output = solution_part_one(
    read_all_lines_from_input("part_one_test")
)
print("Part one test: ", part_one_test_output)

part_one_final_output = solution_part_one(
    read_all_lines_from_input("part_one_input")
)
print("Part one final: ", part_one_final_output)

print()

part_two_test_output = solution_part_two(
    read_all_lines_from_input("part_one_test")
)
print("Part two test: ", part_two_test_output)

part_two_final_output = solution_part_two(
    read_all_lines_from_input("part_one_input")
)
print("Part two final: ", part_two_final_output)
