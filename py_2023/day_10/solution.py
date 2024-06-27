from py_2023.utils import test_solutions, Test


############
# Part one #
############

def solution_part_one(lines):
    return "Part 1 not implemented"


############
# Part two #
############

def solution_part_two(lines):
    return "Part 2 not implemented"


################
# Calling code #
################

TEST_PART_ONE_FILE = "test_1"
FINAL_PART_ONE_FILE = None

TEST_PART_TWO_FILE = None
FINAL_PART_TWO_FILE = None

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
