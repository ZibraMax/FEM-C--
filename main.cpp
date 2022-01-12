#include <iostream>
#include <string>
#include <vector>
#include "Element.h"
#include "Utils.h"

#include "Eigen/Dense"
#include "nlohmann/json.hpp"

int main(int argc, char const *argv[])
{
    std::vector<std::vector<double>> coords = {{0.2, 1.1},
                                               {5.5, 3.2}};
    std::vector<std::vector<int>>
        gdls = {{0, 1},
                {2, 3}};

    FEM::Element *elemento = new FEM::Element(coords, gdls);

    nlohmann::json j2 = {
        {"pi", 3.141},
        {"happy", true},
        {"name", "Niels"},
        {"nothing", nullptr},
        {"answer", {{"everything", 42}}},
        {"list", {1, 0, 2}},
        {"object", {{"currency", "USD"}, {"value", 42.99}}}};
    std::cout << j2 << std::endl;
    std::cout << elemento->Ke << std::endl;
    return 0;
}
