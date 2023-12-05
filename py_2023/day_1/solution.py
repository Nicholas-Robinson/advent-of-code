from py_2023.utils import read_all_lines_from_input


###############################################
# First attempt at part one - Simple solution #
###############################################

def part_one(file_name):
    # Open the file and read the lines
    file = open(file_name, "r")
    lines = file.readlines()

    all_numbers = []  # new empty list to gather all the list of numbers for each line
    for line in lines:  # Run the following for each line in the input lines
        number = []  # new empty list to gather the list of number in this line

        for char in line:  # Run the following for each character in this line
            if char.isdigit():  # If this character is a digit
                number.append(
                    int(char))  # Turn it into a number (integer) and add it to the end of the number for this line

        # Now that we have all the digits from that line - add this list to the end of the list of all number lists
        all_numbers.append(number)

    # We now have a list of lists containing all the numbers in the line
    # ie. ["jk1mhjk3iu4", "kk3jk4lkj4" -> [[1, 3, 4], [3, 4, 4]]

    sum_output = 0  # The starting sum of all the numbers in the list
    # Run through each list of numbers in the list of lists (numbers will be a list of numbers from a line in the input)
    for numbers in all_numbers:
        first_n = numbers[0]  # Get the first number from this list
        last_n = numbers[-1]  # Get the last number from this list
        sum_output += (10 * first_n) + last_n  # Create a number and add that to the sum ([1, 3] -> 1 * 10 + 3 -> 13)

    # Return this sum
    return sum_output


###############################################
# First attempt at part two - Simple solution #
###############################################

# A mapping between the text version of a number, and it's FINAL numeric value
# i.e. "fifteen" = 5 as we don't care about the 1
NUMBER_LOOKUP = {
    "eleven": 1,
    "twelve": 2,
    "thirteen": 3,
    "fifteen": 5,
    "twenty": 0,
    "thirty": 0,
    "forty": 0,
    "fifty": 0,
    "sixty": 0,
    "seventy": 0,
    "eighty": 0,
    "ninety": 0,
    "hundred": 0,
    "thousand": 0,
    "million": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 0,
}
# Extract all the "keys" from this mapping to create a list of number in text form to search through
NUMBER_NAMES = NUMBER_LOOKUP.keys()


def part_two(file_name):
    # Open the file and read the lines
    file = open(file_name, "r")
    lines = file.readlines()

    all_numbers = []  # new empty list to gather all the list of numbers for each line
    for line in lines:  # Run the following for each line in the input lines
        numbers = []  # new empty list to gather the list of number in this line

        # This time we are going to run through the index of each character in the line
        # ie. from 0 to the number of characters in the line
        #     i will be set to the next index in turn for each iteration
        for i in range(0, len(line)):
            char = line[i]  # Getting the character in the line at index i

            if char.isdigit():  # If this character is a digit
                numbers.append(
                    int(char))  # Turn it into a number (integer) and add it to the end of the number for this line
                continue
                # NOTE: continue is a python key word that means: 
                #       we are done with this iteration (of the closest loop, ie. for i in range(0, len(line)):)
                #       -> Skip everything in the loop after this point
                #       -> get the next i and start the next iteration

            for num_name in NUMBER_NAMES:  # Run through each text version of the number
                # Check is the next segment of the line is that that word
                if test_is_start_of(num_name, line, i):
                    # If so - Get the number version of that name from the mapping
                    #       -> Append that number to the list of numbers for this line
                    numbers.append(NUMBER_LOOKUP[num_name])
                    break
                    # NOTE: break is a python key word that means: 
                    #       we are done with this iteration (OF THE CLOSEST LOOP, ie. for num_name in NUMBER_NAMES:)
                    #       -> Skip everything in THIS loop (not the index loop) after this point
                    #       -> get the next number name and start the next iteration

        # Add the list of numbers for this line to the list of lists
        all_numbers.append(numbers)

    # We now have a list of lists containing all the numbers in the line
    # ie. ["jkonemhjk3iu4", "kk3jkfourlkj4" -> [[1, 3, 4], [3, 4, 4]]

    sum_output = 0  # The starting sum of all the numbers in the list
    # Run through each list of numbers in the list of lists (numbers will be a list of numbers from a line in the input)
    for numbers in all_numbers:
        first_n = numbers[0]  # Get the first number from this list
        last_n = numbers[-1]  # Get the last number from this list
        sum_output += (10 * first_n) + last_n  # Create a number and add that to the sum ([1, 3] -> 1 * 10 + 3 -> 13)

    return sum_output


###################################################
# Second attempt at part one - Optimized solution #
###################################################


def part_one_optimized(lines):  # Takes the list of lines instead of the file name
    # This is a list comprehension...
    # You can read [int(char) for char in line if char.isdigit()] like this: 
    #   Apply "int(char)" to
    #   --> each character in the line
    #   --> IFF it is a digit
    #   ==> Compile the result of this operation into a list
    all_numbers = [
        [int(char) for char in line if char.isdigit()]
        for line in lines
    ]

    # We are then taking all of those number
    #  -> Passing that into the utility that gets the final numbers ie [[1, 2, 3], [1]] -> [13, 11]
    #  -> and passed that result into the sum function provided by python
    #       * the sum function will add a list of numbers together
    return sum(get_first_and_last_as_numbers(all_numbers))


###################################################
# Second attempt at part two - Optimized solution #
###################################################


def part_two_optimized(lines):  # Takes the list of lines instead of the file name
    all_numbers = [
        [
            out
            for i in range(len(line))
            for out in [get_numeric_value(line, i)]
            if out != 0
        ]
        for line in lines
    ]

    return sum(get_first_and_last_as_numbers(all_numbers))


################################
# Utility functions used above #
################################


# This is going to take in
#  -> the text version of a number
#  -> the current line that we are working on
#  -> the index of the character that we are processing
# 
# it will then take the sub-string of the line, starting at index and reading the length of the input number
#   ie. num_text = "one", line = "joneh", index = 0 
#       --> we are going to read 3 (the length of "one") characters from line = "jon"
#   ie. num_text = "three", line = "joneh", index = 0 
#       --> we are going to read 5 (the length of "three") characters from line = "joneh"
# 
# And see if that is equal to the input text
#   ("==" checks that the left and right are equal)
#   ("=" assigns the value on the right to the variable on the left)
def test_is_start_of(num_text, line, from_index):
    test = line[from_index:(from_index + len(num_text))]
    return test == num_text


def get_first_and_last_as_numbers(number_lists):
    return [nums[0] * 10 + nums[-1] for nums in number_lists if len(nums) > 0]


def get_numeric_value(line, from_index):
    if line[from_index].isdigit():
        return int(line[from_index])

    return next((NUMBER_LOOKUP[num_text] for num_text in NUMBER_NAMES if test_is_start_of(num_text, line, from_index)),
                0)


#####################
# Running the tests #
#####################


print("== FIRST PASS ==")


PART_ONE_TEST = "part-one-test"
PART_ONE_INPUT = "part-one-input"
print()
print("Part one test: ", part_one("./input/" + PART_ONE_TEST + ".txt"))
print("Part one input: ", part_one("./input/" + PART_ONE_INPUT + ".txt"))

PART_TWO_TEST = "part-two-test"
PART_TWO_INPUT = PART_ONE_INPUT
print()
print("Part two test: ", part_two("./input/" + PART_TWO_TEST + ".txt"))
print("Part two test: ", part_two("./input/" + PART_TWO_INPUT + ".txt"))

print()
print("== OPTIMIZED PASS ==")

LINES_TEST_PART_ONE = read_all_lines_from_input(PART_ONE_TEST)
LINES_INPUT_PART_ONE = read_all_lines_from_input(PART_ONE_INPUT)
print()
print("Part one (optimised) test: ", part_one_optimized(LINES_TEST_PART_ONE))
print("Part one (optimised) input: ", part_one_optimized(LINES_INPUT_PART_ONE))

LINES_TEST_PART_TWO = read_all_lines_from_input(PART_TWO_TEST)
LINES_INPUT_PART_TWO = read_all_lines_from_input(PART_ONE_INPUT)
print()
print("Part two (optimised) test: ", part_two_optimized(LINES_TEST_PART_TWO))
print("Part two (optimised) input: ", part_two_optimized(LINES_INPUT_PART_TWO))
