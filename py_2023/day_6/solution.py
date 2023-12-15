import re

from py_2023.utils import test_solutions, Test


############
# Part one #
############

def solution_part_one(lines):
    races = list(parse_time_distance(lines[0], lines[1]))
    return product([simular_race(time, record) for time, record in races])


def product(num_list):
    output = 1
    for n in num_list:
        output *= n
    return output


def simular_race(max_race_time, current_record):
    return len([
        travelled_distance
        for press_time in range(max_race_time)
        for travelled_distance in [press_time * (max_race_time - press_time)]
        if travelled_distance > current_record
    ])


def parse_time_distance(times, distances):
    return zip(parse_numbers(times), parse_numbers(distances))


# "*****: n, m ,n"  --> [n, m ,n]
def parse_numbers(line):
    number_part = line.split(':')[-1]
    return [
        int(num)
        for num
        in re.sub(" +", " ", number_part).strip().split(" ")
    ]


############
# Part two #
############

def solution_part_two(lines):
    time = parse_big_number(lines[0])
    record = parse_big_number(lines[1])

    losses = 0
    for left_press_time in range(time):
        travelled_distance_left = left_press_time * (time - left_press_time)

        right_press_time = time - left_press_time
        travelled_distance_right = right_press_time * (time - right_press_time)

        if travelled_distance_left <= record:
            losses += 1

        if travelled_distance_right <= record:
            losses += 1

        if travelled_distance_left > record and travelled_distance_right > record:
            break

    return time - losses + 1


def parse_big_number(line):
    number_part = line.split(':')[-1]
    return int(re.sub(" +", "", number_part).strip())


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
