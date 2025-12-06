cmake_minimum_required(VERSION 4.0)
project(2025)

set(CMAKE_CXX_STANDARD 20)

add_executable(2025 main.cpp
        Day1/Solution.cpp
        Day1/Solution.h
        Core/ISolution.h)