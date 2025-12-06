#include <filesystem>
#include <fstream>
#include <iostream>

#include "Day1/Solution.h"

namespace fs = std::filesystem;
using input_files = std::tuple<std::vector<std::string>, std::vector<std::string> >;

std::string readFileContents(const std::string &location) {
    std::ifstream file(location);

    std::string contents;
    std::string line;
    while (std::getline(file, line)) {
        contents += line + "\n";
    }

    return contents;
}

template<typename T>
std::tuple<std::vector<T>, std::vector<T> > readDay(const std::string &location, Core::ISolution<T> &solution) {
    std::vector<T> dayOne;
    std::vector<T> dayTwo;

    for (const auto &entry: fs::directory_iterator("../" + location)) {
        if (entry.path().string().ends_with(".one.txt"))
            dayOne.push_back(solution.Parse(readFileContents(entry.path().string())));

        if (entry.path().string().ends_with(".two.txt"))
            dayTwo.push_back(solution.Parse(readFileContents(entry.path().string())));
    }

    return {dayOne, dayTwo};
}

int main() {
    Day::Solution solution;
    auto files = readDay(Day::Location, solution);

    auto a = std::get<0>(files);
}
