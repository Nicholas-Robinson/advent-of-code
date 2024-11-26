from py_2023.utils import test_solutions, Test


############
# Part one #
############

def solution_part_one(lines):
    matrices = [build_matrix(line) for line in lines]
    number_vecs = [build_next_number_vec(mat) for mat in matrices]

    return sum([vec[-1] for vec in number_vecs])


def build_matrix(line):
    matrix = [[int(n) for n in line.split(" ")]]

    while sum(matrix[-1]) != 0:
        last_line = matrix[-1]
        next_line = [
            last_line[i] - last_line[i - 1]
            for i in range(1, len(last_line))
        ]
        matrix.append(next_line)

    matrix.reverse()
    return matrix


def build_next_number_vec(matrix):
    for row_i in range(1, len(matrix)):
        matrix[row_i].append(matrix[row_i - 1][-1] + matrix[row_i][-1])

    return [row[-1] for row in matrix]


############
# Part two #
############

def solution_part_two(lines):
    matrices = [build_matrix(line) for line in lines]
    for mat in matrices:
        for row in mat:
            row.reverse()

    number_vecs = [build_prev_number_vec(mat) for mat in matrices]

    return sum([vec[-1] for vec in number_vecs])


def build_prev_number_vec(matrix):
    for row_i in range(1, len(matrix)):
        matrix[row_i].append(matrix[row_i][-1] - matrix[row_i - 1][-1])

    return [row[-1] for row in matrix]


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
