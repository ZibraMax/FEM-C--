#include <iostream>
#include <string>
#include <vector>
#include "Geometry.h"
#include "PlaneStress.h"
#include "Utils.h"

#include "nlohmann/json.hpp"

int main(int argc, char const *argv[])
{

    std::vector<std::vector<double>> coords = {{0.0, 0.0},
                                               {0.5, 0.0},
                                               {1.0, 0.0},
                                               {1.5, 0.0},
                                               {2.0, 0.0},

                                               {0.0, 0.5},
                                               {1.0, 0.5},
                                               {2.0, 0.5},

                                               {0.0, 1.0},
                                               {0.5, 1.0},
                                               {1.0, 1.0},
                                               {1.5, 1.0},
                                               {2.0, 1.0},
                                               {0.0, 1.5},
                                               {0.5, 1.5},
                                               {0.0, 2.0},
                                               {1.5, 2.0}};
    std::vector<std::vector<int>> dicts = {{0, 2, 10, 8, 1, 6, 9, 5}, {2, 4, 12, 10, 3, 7, 11, 6}, {8, 10, 15, 9, 14, 13}, {14, 16, 15}, {10, 11, 16, 14}};
    std::vector<std::string> types = {"C2V", "C2V", "T2V", "T1V", "C1V"};

    // FEM::Geometry *geometria = new FEM::Geometry(coords, dicts, types, 1);
    FEM::Geometry *geometria = new FEM::Geometry("../beam_geometry.json");

    double E = 21000000.0;
    double v = 0.2;
    double t = 0.3;
    double rho = 23.54 / 9.81;
    double fx = 0.0;
    double fy = -rho * 9.8 * t;
    FEM::PlaneStress O = FEM::PlaneStress(geometria, E, v, t, rho, fx, fy);
    std::cout << "=========================================" << std::endl;
    O.elementMatrices();
    O.ensembling();
    O.borderConditions();
    std::cout << "=========================================" << std::endl;
    // Utils::writeToCSVfile("K.csv", O.K);
    // Utils::writeToCSVfile("M.csv", O.M);
    // Utils::writeToCSVfile("S.csv", O.S);
    O.solveES();
    std::cout << "=========================================" << std::endl;
    Utils::writeToCSVfile("U.csv", O.U);

    return 0;
}
