#include <iostream>
#include <string>
#include <vector>
#include "Element.h"
#include "Element2D.h"
#include "LTriangular.h"
#include "Utils.h"

#include "Eigen/Dense"
#include "nlohmann/json.hpp"

int main(int argc, char const *argv[])
{
    std::vector<std::vector<double>> coords = {{0.2, 2.5, 5.9},
                                               {1.1, 3.2, 1.2}};
    std::vector<std::vector<int>>
        gdls = {{1, 0, 2}};

    FEM::Element *elemento = new FEM::LTriangular(coords, gdls);

    Eigen::VectorXd U(5);
    U << 7.0, 6.0, 5.0, 4.0, 3.0;
    elemento->setUe(U);
    std::cout << elemento->Ue << std::endl;

    // nlohmann::json j2 = {
    //     {"pi", 3.141},
    //     {"happy", true},
    //     {"name", "Niels"},
    //     {"nothing", nullptr},
    //     {"answer", {{"everything", 42}}},
    //     {"list", {1, 0, 2}},
    //     {"object", {{"currency", "USD"}, {"value", 42.99}}}};
    // std::cout << j2 << std::endl;
    std::cout << elemento->Ke << std::endl;
    std::cout << elemento->coords.row(0).array() + 1.0 << std::endl;
    std::cout << "----------------" << std::endl;

    Eigen::MatrixXd p_prueba(2, 3);

    p_prueba << 0.0, 1.0, 0.0, 0.0, 0.0, 1.0;

    std::cout << elemento->z << std::endl;
    std::cout << "----------------" << std::endl;
    // std::cout << elemento->psis(p_prueba) << std::endl;
    std::cout << elemento->psis(elemento->z) << std::endl;
    return 0;
}
