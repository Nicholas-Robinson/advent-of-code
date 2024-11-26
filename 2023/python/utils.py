def read_all_lines_from_input(file_name: str, ext: str = 'txt') -> list[str]:
    file_path = "./input/" + file_name + "." + ext
    lines = open(file_path, "r").readlines()

    return [line.strip() for line in lines]


class Test:
    def __init__(self, solution):
        self.test_input = None
        self.final_input = None
        self.solution = solution

    def with_test_input(self, file_name):
        self.test_input = file_name
        return self

    def with_final_input(self, file_name):
        self.final_input = file_name
        return self

    def run(self, part: int):
        if self.test_input is not None:
            self.run_with(self.test_input, part + 1)

        if self.final_input is not None:
            self.run_with(self.final_input, part + 1)

        print()

    def run_with(self, file, part):
        lines = read_all_lines_from_input(file)
        print("Part", part, "test:", self.solution(lines))


def test_solutions(tests: list[Test]):
    for part, test in enumerate(tests):
        test.run(part)
