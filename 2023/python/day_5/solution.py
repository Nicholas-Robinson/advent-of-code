from py_2023.utils import test_solutions, Test


############
# Part one #
############

class Range:
    def __init__(self, destination, source, range_value):
        self.offset = source - destination
        self.source_upper = source + range_value
        self.source_lower = source

    def is_in_rage(self, target):
        return self.source_lower <= target < self.source_upper

    def lookup(self, target):
        return target - self.offset


class LookMap:
    def __init__(self, ranges, next_lookup):
        self.ranges = ranges
        self.next_lookup = next_lookup

    def get_destination_value(self, source_value):
        for r in self.ranges:
            if r.is_in_rage(source_value):
                return r.lookup(source_value)

        return source_value

    def traverse(self, source_value):
        to = self.get_destination_value(source_value)
        if self.next_lookup is not None:
            return self.next_lookup.traverse(to)
        else:
            return to


def solution_part_one(lines):
    seeds, lookup_raw = parse_input(lines)

    first_lookup, prev_lookup = None, None
    for ranges_raw in lookup_raw:
        ranges = []
        for range_raw in ranges_raw:
            d, s, r = range_raw.split(" ")
            ranges.append(Range(int(d), int(s), int(r)))

        lookup = LookMap(ranges, None)
        if first_lookup is None:
            first_lookup = lookup
            prev_lookup = lookup
        else:
            prev_lookup.next_lookup = lookup
            prev_lookup = lookup

    return min([first_lookup.traverse(seed) for seed in seeds])


def parse_input(lines):
    seeds_line = lines[0]
    rest = lines[3:len(lines)]

    # Seeds
    seed_numbers = seeds_line.split(":")[-1].strip()
    seeds = [int(seed) for seed in seed_numbers.split(" ")]

    seed_to_soil = read_map_lines(rest)
    rest = rest[len(seed_to_soil) + 2:len(rest)]

    soil_to_fertilizer = read_map_lines(rest)
    rest = rest[len(soil_to_fertilizer) + 2:len(rest)]

    fertilizer_to_water = read_map_lines(rest)
    rest = rest[len(fertilizer_to_water) + 2:len(rest)]

    water_to_light = read_map_lines(rest)
    rest = rest[len(water_to_light) + 2:len(rest)]

    light_to_temp = read_map_lines(rest)
    rest = rest[len(light_to_temp) + 2:len(rest)]

    temp_to_humid = read_map_lines(rest)
    rest = rest[len(temp_to_humid) + 2:len(rest)]

    humid_to_location = read_map_lines(rest)

    return seeds, [seed_to_soil, soil_to_fertilizer, fertilizer_to_water, water_to_light, light_to_temp, temp_to_humid,
                   humid_to_location]


def read_map_lines(lines):
    output = []
    pos = 0

    while pos < len(lines) and lines[pos] != "":
        output.append(lines[pos])
        pos += 1

    return output


############
# Part two #
############

def solution_part_two(lines):
    seeds, lookup_raw = parse_input(lines)

    first_lookup, prev_lookup = None, None
    for ranges_raw in lookup_raw:
        ranges = []
        for range_raw in ranges_raw:
            d, s, r = range_raw.split(" ")
            ranges.append(Range(int(d), int(s), int(r)))

        lookup = LookMap(ranges, None)
        if first_lookup is None:
            first_lookup = lookup
            prev_lookup = lookup
        else:
            prev_lookup.next_lookup = lookup
            prev_lookup = lookup

    print("Init complete")

    smallest = None
    for seed_i in range(0, len(seeds), 2):
        seed = seeds[seed_i]
        seed_range = seeds[seed_i + 1]
        print("Processing", seed, seed_range)
        for source in range(seed, seed + seed_range):
            location = first_lookup.traverse(source)
            if smallest is None:
                smallest = location
            else:
                smallest = min(smallest, location)

    return smallest


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
