#include <iostream>
#include <vector>
#include <string>
#include <tuple>

#define MAX_INT 2147483647

namespace Part1
{

    void solution(int width, int height, int take, std::vector<std::tuple<int, int>> coords)
    {
        std::vector<int> map;

        for (int i = 0; i < height; i++)
        {
            for (int j = 0; j < width; j++)
            {
                map.push_back(MAX_INT);
            }
        }

        for (int i = 0; i < take; i++)
        {
            std::tuple<int, int> coord = coords.at(i);
            int x = std::get<0>(coord);
            int y = std::get<1>(coord);

            map[y * width + x] = -1;
        }

        std::vector<std::tuple<int, int, int>> toProcess;
        toProcess.push_back(std::make_tuple(0, 0, 0));

        while (toProcess.size() > 0)
        {

            std::tuple<int, int, int> next = toProcess.back();
            toProcess.pop_back();

            int x = std::get<0>(next);
            int y = std::get<1>(next);
            int cost = std::get<2>(next);

            if (x < 0 || x >= width || y < 0 || y >= height)
                continue;

            int current = map[y * width + x];

            if (current == -1 || current < cost)
                continue;

            map[y * width + x] = cost;

            if (map[y * width + (x + 1)] > cost + 1)
                toProcess.push_back(std::make_tuple(x + 1, y, cost + 1));

            if (map[y * width + (x - 1)] > cost + 1)
                toProcess.push_back(std::make_tuple(x - 1, y, cost + 1));

            if (map[(y + 1) * width + x] > cost + 1)
                toProcess.push_back(std::make_tuple(x, y + 1, cost + 1));

            if (map[(y - 1) * width + x] > cost + 1)
                toProcess.push_back(std::make_tuple(x, y - 1, cost + 1));
        }

        std::cout << map[width * height - 1] << std::endl;
    }

}