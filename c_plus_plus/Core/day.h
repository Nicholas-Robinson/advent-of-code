//
// Created by Nicholas Robinson on 23/10/2025.
//

#ifndef C_PLUS_PLUS_DAY_H
#define C_PLUS_PLUS_DAY_H

#include <filesystem>
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <string>


#define COMMON_INPUT_FILE "input.txt"
#define BUILD_PATH(year, day) ("../" + std::to_string(year) + "/Day" + std::to_string(day))

#ifndef INPUT_DELIM_PREFIX
#define INPUT_DELIM_PREFIX "UNSET"
#endif

namespace AOC {
	struct TestCase {
		std::string name;
		std::string rawInput;
	};

	struct TestResult {
		std::string name;
		std::string result;
	};

	/// The base interface for running a day's solution
	class IDay {
	public:
		virtual ~IDay() = default;
		virtual TestResult PartOne(TestCase &testCase) = 0;
		virtual TestResult PartTwo(TestCase &testCase) = 0;
	};

	/// This is the base implementation of a day
	/// All day solutions should extend this class
	/// and when imported into the main file will
	/// be used as a standard interface to run parse
	/// input and run the solution parts
	template<typename Input>
	class Day : public IDay {
	public:
		virtual Input Parse(std::string &raw) = 0;
		virtual std::string PartOneSolution(Input input) = 0;
		virtual std::string PartTwoSolution(Input input) = 0;

		TestResult PartOne(TestCase &testCase) override {
			return {testCase.name, PartOneSolution(Parse(testCase.rawInput))};
		}

		TestResult PartTwo(TestCase &testCase) override {
			return {testCase.name, PartTwoSolution(Parse(testCase.rawInput))};
		}
	};

	/// Utility for printing a year/day string
	inline std::string formatYD(int year, int day) { return std::format("Y%dD%d", year, day); }

	/// This is a way to define the existence of a solution
	/// it will be used by the main function to get an instance
	/// of the solution which it will use to run the test files
	class DayRegistry {
		using FactoryMethod = std::function<std::unique_ptr<IDay>()>;

	public:
		static DayRegistry &instance() {
			static DayRegistry instance;
			return instance;
		}

		void registerDay(int year, int day, const FactoryMethod &factory) {
			const std::tuple key(year, day);
			if (m_factories.contains(key)) {
				printf("Duplicate registration for Y%dD%d - using the first one", year, day);
				return;
			}

			m_factories[key] = factory;
		}

		std::unique_ptr<IDay> buildDay(int year, int day) {
			const std::tuple key(year, day);

			if (!m_factories.contains(key))
				throw std::runtime_error("Day registration does not exist " + std::format("Y%dD%d", year, day));

			return m_factories[key]();
		}

	private:
		std::map<std::tuple<int, int>, FactoryMethod> m_factories;
	};

	/// This is a class that will be used to construct
	/// a factory method for creation. This is to be used
	/// in conjunction with the Registry and the meta function
	/// to register a day instance.
	template<typename T>
	class DayRegistration {
	public:
		explicit DayRegistration(int year, int day) {
			DayRegistry::instance().registerDay(year, day, [] { return std::make_unique<T>(); });
		}
	};

	/// === UTILITY METHODS ===

	inline std::optional<std::string> readFile(const std::filesystem::path &path) {
		std::ifstream file(path);
		if (!file.is_open())
			return std::nullopt;

		std::stringstream buffer;
		buffer << file.rdbuf();

		return buffer.str();
	}

	inline std::tuple<std::optional<std::string>, std::optional<std::string>>
	readInputFiles(const int year, const int day) {
		const std::filesystem::path path = BUILD_PATH(year, day);
		const auto inputFilePath = path / COMMON_INPUT_FILE;

		std::cout << inputFilePath.string() << std::endl;

		if (!std::filesystem::exists(inputFilePath))
			throw std::runtime_error("No input.txt file found");

		const auto contents = readFile(inputFilePath).value_or(nullptr);

		std::cout << contents << std::endl;

		// return {readFile(path / PART_ONE_INPUT_FILE), readFile(path / PART_TWO_INPUT_FILE)};
		return {{}, {}};
	}

	inline void runDay(const int year, const int day) {
		const auto day_p = DayRegistry::instance().buildDay(year, day);
		const auto inputs = readInputFiles(year, day);

		std::cout << "=== Running | Year: " << year << " Day: " << day << " ===" << std::endl;

		// if (auto partOneInput = std::get<0>(inputs); partOneInput.has_value() && !partOneInput.value().empty()) {
		// std::cout << "Part one: " << day_p->PartOne(partOneInput.value()) << std::endl;
		// }

		// if (auto partTwoInput = std::get<0>(inputs); partTwoInput.has_value() && !partTwoInput.value().empty())
		// std::cout << "Part two: " << day_p->PartTwo(partTwoInput.value()) << std::endl;

		std::cout << "=== Success | Year: " << year << " Day: " << day << " ===" << std::endl;
	}

} // namespace AOC

#define CONCAT_5_IMPL(a, b, c, d, e) a##b##c##d##e
#define CONCAT_5(a, b, c, d, e) CONCAT_5_IMPL(a, b, c, d, e)

#define REGISTER_DAY(DayClass, year, day)                                                                              \
	namespace {                                                                                                        \
		AOC::DayRegistration<DayClass> CONCAT_5(registration_, year, _, day, _##DayClass)(year, day);                  \
	}

#endif // C_PLUS_PLUS_DAY_H
