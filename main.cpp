#include <iostream>
#include <string>
#include <vector>
#include "Element.h"

int main(int argc, char const *argv[])
{
    std::vector<std::vector<double>> coords = {{0.2, 1.1},
                                               {5.5, 3.2}};
    std::vector<std::vector<int>>
        gdls = {{0, 1},
                {2, 3}};

    Element *elemento = new Element(coords, gdls);
    return 0;
}
