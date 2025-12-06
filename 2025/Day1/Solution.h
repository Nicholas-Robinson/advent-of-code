//
// Created by Nicholas Robinson on 22/10/2025.
//

#ifndef INC_2025_SOLUTION_H
#define INC_2025_SOLUTION_H
#include "../Core/ISolution.h"

namespace Day {
    static const std::string Location = "Day1";

    class Solution final : public Core::ISolution<std::string> {
    public:
        std::string Parse(std::string) override;

        void PartOne(const std::string *) override;

        void PartTwo(const std::string *) override;

        ~Solution() override;
    };
} // Day

#endif //INC_2025_SOLUTION_H
