#include <iostream>
#include <string>
#include <vector>
#include "Element.h"
#include "Element2D.h"
#include "LTriangular.h"
#include "Serendipity.h"
#include "Quadrilateral.h"
#include "Utils.h"

#include "Eigen/Dense"
#include "nlohmann/json.hpp"

int main(int argc, char const *argv[])
{
    std::vector<std::vector<double>> coords = {{0.2, 2.5, 5.9, 1.1},
                                               {1.1, 3.2, 1.2, 0.8}};
    std::vector<std::vector<int>>
        gdls = {{1, 0, 2, 3}};

    FEM::Element *elemento = new FEM::Quadrilateral(coords, gdls);

    // Eigen::VectorXd U(9);
    // U << 7.0, 6.0, 5.0, 4.0, 3.0, 6.7, 2.3, 4.6, 5.7;
    // elemento->setUe(U);
    // std::cout << elemento->Ue << std::endl;

    // nlohmann::json j2 = {
    //     {"pi", 3.141},
    //     {"happy", true},
    //     {"name", "Niels"},
    //     {"nothing", nullptr},
    //     {"answer", {{"everything", 42}}},
    //     {"list", {1, 0, 2}},
    //     {"object", {{"currency", "USD"}, {"value", 42.99}}}};
    // std::cout << j2 << std::endl;
    // std::cout << elemento->Ke << std::endl;
    std::cout << "----------------" << std::endl;

    Eigen::MatrixXd p_prueba(2, 4);

    p_prueba << -1.0, 1.0, 1.0, -1.0,
                -1.0,-1.0, 1.0,  1.0;
    std::cout << "----------------" << std::endl;
    std::cout << elemento->z << std::endl;
    std::cout << "----------------" << std::endl;
    std::cout << elemento->w << std::endl;
    std::cout << "----------------" << std::endl;
    std::cout << p_prueba << std::endl;
    std::cout << "----------------" << std::endl;
    std::cout << elemento->psis(p_prueba) << std::endl;
    std::cout << "----------------" << std::endl;
    std::cout << elemento->psis(elemento->z) << std::endl;
    std::cout << "----------------" << std::endl;
    std::cout << elemento->T(p_prueba) << std::endl;
    std::cout << "----------------" << std::endl;
    auto jacs = elemento->J(elemento->z);
    for (auto jac : jacs)
    {
        std::cout << "----------------" << std::endl;
        std::cout << jac << std::endl;
    }

    return 0;
}
