//
// Created by Nicholas Robinson on 23/10/2025.
//

#ifndef C_PLUS_PLUS_DAY1_H
#define C_PLUS_PLUS_DAY1_H

#include "../../Core/day.h"


namespace Day1 {
	struct Input {
		std::vector<int> left;
		std::vector<int> right;
	};

	class Solution final : public AOC::Day<Input> {
	public:
		Input Parse(std::string &) override;
		std::string PartOneSolution(Input input) override;
		std::string PartTwoSolution(Input input) override;
	};

	REGISTER_DAY(Solution, 2024, 1)
} // namespace Day1


#endif // C_PLUS_PLUS_DAY1_H
