//
// Created by Nicholas Robinson on 22/10/2025.
//

#ifndef INC_2025_ISOLUTION_H
#define INC_2025_ISOLUTION_H

#include <string>

namespace Core {
    template<typename Input>
    class ISolution {
    public:
        virtual ~ISolution() = default;

        virtual Input Parse(std::string);

        virtual void PartOne(const Input *);

        virtual void PartTwo(const Input *);
    };
}

#endif //INC_2025_ISOLUTION_H
