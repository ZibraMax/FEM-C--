#include <iostream>
#include <string>
#include <vector>
#include "Geometry.h"
#include "Element2D.h"
#include "LTriangular.h"
#include "Serendipity.h"
#include "Quadrilateral.h"
#include "Utils.h"

#include "Eigen/Dense"
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
                                                {2.0, 1.0}};
    std::vector<std::vector<int>> dicts = {{0,2,10,8,1,6,9,5},{2,4,12,10,3,7,11,6}};
    std::vector<std::string> types = {"C2V","C2V"};

    FEM::Geometry geometria = FEM::Geometry(coords,dicts,types,1);

    std::cout<<geometria<<std::endl;
    return 0;
}
