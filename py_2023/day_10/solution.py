from py_2023.utils import test_solutions, Test

############
# Part one #
############


N, S, E, W = [1 << n for n in range(4)]
HOME_TILE = (N | S | E | W)

DIRECTION_EXITING_TILE = {
    ".": 0,
    "S": HOME_TILE,
    "|": (N | S),
    "-": (E | W),
    "L": (N | E),
    "J": (N | W),
    "7": (S | W),
    "F": (S | E),
}

NEXT_POSSIBLE_DIRECTIONS = {
    N: (N | E | W),
    S: (S | E | W),
    E: (E | N | S),
    W: (W | N | S),
}

DIRECTION_DIFFERENCE = {N: (-1, 0), S: (1, 0), E: (0, 1), W: (0, -1)}
PRINT_ITEMS = {N: "^", S: "v", E: ">", W: "<"}


def solution_part_one(lines):
    masked_matrix = [
        [DIRECTION_EXITING_TILE[c] for c in list(line)]
        for line in lines
    ]

    r, c = get_staring_point(masked_matrix)

    possible_paths = [
        path
        for direction in [N, E, S, W]
        for path in [try_path(masked_matrix, direction, r, c)]
        if len(path) > 0
    ]

    output = []
    for path in possible_paths:
        print_template = [["." for _ in list(line)] for line in lines]
        output.append(print_template)
        for (r, c, d) in path:
            print_template[r][c] = PRINT_ITEMS[d]

    printer = []
    for out in output:
        printer.append("\n".join(["\t".join(row) for row in out]))

    return "\n" + "\n\n".join(printer)


def get_staring_point(masked_matrix):
    for ri, row in enumerate(masked_matrix):
        for ci, cell in enumerate(row):
            if masked_matrix[ri][ci] == HOME_TILE:
                return ri, ci


def try_path(masked_matrix, initial_direction, start_r, start_c):
    height, width = len(masked_matrix), len(masked_matrix[0])
    steps_taken = [(start_r, start_c, initial_direction)]

    travelling = initial_direction
    r, c = start_r, start_c

    while True:
        dr, dc = DIRECTION_DIFFERENCE[travelling]
        r, c = r + dr, c + dc

        if not (0 <= r < height and 0 <= c < width):
            return []

        tile = masked_matrix[r][c]
        if tile == HOME_TILE:
            return steps_taken

        travelling = tile & NEXT_POSSIBLE_DIRECTIONS[travelling]
        steps_taken.append((r, c, travelling))

        if not travelling or (travelling & -travelling) - travelling:
            return []


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
