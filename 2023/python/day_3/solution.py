from py_2023.utils import test_solutions, Test


############
# Part one #
############

class Cell:
    def __init__(self, value):
        self.value = value
        self.is_counted = False
        self.connected_parts = set()

    def is_digit(self):
        return self.value.isdigit()

    def get_value_as_number(self):
        return int(self.value)

    def is_symbol(self):
        return not self.is_digit() and self.value != "."

    def is_asterisk(self):
        return self.value == "*"

    def is_cog(self):
        return len(self.connected_parts) == 2

    def get_gear_ratio(self):
        a, b = self.connected_parts
        return a.get_value_as_number() * b.get_value_as_number()


def solution_part_one(lines):
    grid = [parse_cells(line) for line in lines]

    height = len(grid)
    width = len(grid[0])

    part_number_list = [
        grid[row][col]

        for row_i in range(height)
        for col_i in range(width)
        if grid[row_i][col_i].is_symbol()

        for (row, col) in get_neighbours(row_i, col_i, width, height)
        if grid[row][col].is_digit()
    ]

    part_number_sum = 0
    for part in part_number_list:
        if not part.is_counted:
            part_number_sum += part.get_value_as_number()
            part.is_counted = True

    return part_number_sum


def bound_to(index, arr_length):
    return max(0, min(index, arr_length))


def get_neighbours(row_i, col_i, width, height):
    row_from_i = bound_to(row_i - 1, height)
    row_to_i = bound_to(row_i + 1, height - 1)

    col_from_i = bound_to(col_i - 1, width)
    col_to_i = bound_to(col_i + 1, width - 1)

    return [
        (row, col)
        for col in range(col_from_i, col_to_i + 1)
        for row in range(row_from_i, row_to_i + 1)
        if (row, col) != (row_i, col_i)
    ]


# 467..114.. -> [467, 467, 467, ., ., ., 114, 114, 114, ., .]
def parse_cells(line):
    output = []
    pos = 0

    while pos < len(line):
        char = line[pos]

        if not char.isdigit():
            output.append(Cell(char))
            pos += 1
            continue

        number_length = get_number_length(line, pos)
        the_number = Cell(line[pos:pos + number_length])
        for i in range(number_length):
            output.append(the_number)
        pos += number_length

    return output


def get_number_length(line, offset):
    number_len = 0

    for i in range(offset, len(line)):
        if line[i].isdigit():
            number_len += 1
        else:
            return number_len

    return number_len


############
# Part two #
############

def solution_part_two(lines):
    grid = [parse_cells(line) for line in lines]

    height = len(grid)
    width = len(grid[0])

    for row in range(height):
        for col in range(width):
            if grid[row][col].is_asterisk():
                for (r, c) in get_neighbours(row, col, width, height):
                    if grid[r][c].is_digit():
                        grid[row][col].connected_parts.add(grid[r][c])

    return sum([
        grid[row][col].get_gear_ratio()

        for row in range(height)
        for col in range(width)
        if grid[row][col].is_asterisk() and grid[row][col].is_cog()
    ])


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
