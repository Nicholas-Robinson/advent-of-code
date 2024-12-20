#include <iostream>
#include <vector>
#include <string>
#include <tuple>

namespace Part2
{

    typedef std::vector<std::string> StringList;
    typedef std::tuple<StringList, StringList> Parsed;
    typedef std::tuple<std::string, int> ProcessItem;

    int testPattern(std::string pattern, StringList towels)
    {
        std::vector<int> toProcess;
        toProcess.push_back(0);

        int count = 0;

        while (toProcess.size() > 0)
        {
            int offset = toProcess.back();
            toProcess.pop_back();

            if (offset == pattern.size())
            {
                count++;
                continue;
            }

            // StringList shotList;
            // for (int i = 0; i < towels.size(); i++)
            // {
            //     std::string towel = towels[i];

            //     if (towel.size() > branch.size())
            //         continue;

            //     if (branch.find(towel) >= 0)
            //         shotList.push_back(towel);
            // }

            for (int i = 0; i < towels.size(); i++)
            {
                std::string towel = towels[i];

                bool valid = true;
                int size = towel.size();
                for (int i = 0; i < size && valid; i++)
                {
                    if (i + offset >= pattern.size())
                        valid = false;

                    if (pattern[i + offset] != towel[i])
                        valid = false;
                }

                if (valid)
                    toProcess.push_back(offset + size);
            }
        }

        return count;
    }

    void solution(Parsed input)
    {
        StringList towels = std::get<0>(input);
        StringList patterns = std::get<1>(input);

        int total = 0;

        for (int i = 0; i < patterns.size(); i++)
        {
            std::string pattern = patterns[i];
            int count = testPattern(pattern, towels);
            std::cout << "Pattern: " << pattern << " Count: " << count << std::endl;
            total += count;
        }

        std::cout << "Total: " << total << std::endl;
    }

}