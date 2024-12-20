#include <iostream>
#include <vector>
#include <string>
#include <tuple>

#include "samples.cpp"
#include "part2.cpp"

int main()
{

    std::cout << std::endl
              << "Part two sample" << std::endl;
    Part2::solution(Inputs::sampleInput());

    std::cout << std::endl
              << "Part two real" << std::endl;
    Part2::solution(Inputs::realInput());

    return 0;
}