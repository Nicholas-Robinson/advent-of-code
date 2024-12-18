#include <iostream>
#include <vector>
#include <string>
#include <tuple>

#include "samples.cpp"
#include "part1.cpp"
#include "part2.cpp"

int main()
{
    std::cout << "Part one sample" << std::endl;
    Part1::solution(7, 7, 12, Inputs::sampleInput1());

    std::cout << std::endl
              << "Part one real" << std::endl;
    Part1::solution(71, 71, 1024, Inputs::realInput1());

    std::cout << std::endl
              << "Part two sample" << std::endl;
    Part2::solution(7, 7, Inputs::sampleInput1());

    std::cout << std::endl
              << "Part two real" << std::endl;
    Part2::solution(71, 71, Inputs::realInput1());

    return 0;
}