def read_all_lines_from_input(file_name: str, ext: str = 'txt') -> list[str]:
    file_path = "./input/" + file_name + "." + ext
    lines = open(file_path, "r").readlines()

    return [line.strip() for line in lines]
