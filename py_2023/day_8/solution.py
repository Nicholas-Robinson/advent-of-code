from py_2023.utils import test_solutions, Test
from math import lcm


############
# Part one #
############

class Node:
    def __init__(self, name):
        self.name = name
        self.left = None
        self.right = None


def solution_part_one(lines):
    instructions = list(lines[0])
    nodes_raw = lines[2:len(lines)]
    nodes_map = parse_node_tree(nodes_raw)

    return get_number_of_steps(nodes_map['AAA'], instructions)


def get_number_of_steps(start_node, instructions):
    steps_taken = 0
    current_instruction = 0
    current_node = start_node
    while current_node.name[-1] != 'Z':
        steps_taken += 1

        if instructions[current_instruction] == 'L':
            current_node = current_node.left
        else:
            current_node = current_node.right

        current_instruction = (current_instruction + 1) % len(instructions)

    return steps_taken


def parse_node_tree(lines):
    nodes_map = {}
    for line in lines:
        node_name = line.split(" =")[0]
        nodes_map[node_name] = Node(node_name)

    for line in lines:
        node_name = line.split(" =")[0]
        children = (line.split("= ")[-1]
                    .replace('(', '')
                    .replace(')', ''))
        l, r = children.split(', ')

        nodes_map[node_name].left = nodes_map[l]
        nodes_map[node_name].right = nodes_map[r]

    return nodes_map


############
# Part two #
############

def solution_part_two(lines):
    instructions = list(lines[0])
    nodes_raw = lines[2:len(lines)]
    nodes_map = parse_node_tree(nodes_raw)

    start_nodes = [
        nodes_map[n] for
        n in nodes_map.keys()
        if n[-1] == 'A'
    ]

    steps_taken = [
        get_number_of_steps(node, instructions)
        for node in start_nodes
    ]

    return lcm(*steps_taken)


################
# Calling code #
################

TEST_PART_ONE_FILE = "test_1"
FINAL_PART_ONE_FILE = "input_1"

TEST_PART_TWO_FILE = "test_2"
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
