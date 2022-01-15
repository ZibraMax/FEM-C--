#ifndef QUADRILATERAL_H
#define QUADRILATERAL_H

#include "RectangularScheme.h"
#include <vector>
#include <iostream>

namespace FEM
{
	class Quadrilateral : public RectangularScheme
	{
	public:
		Quadrilateral(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl);
		Eigen::MatrixXd psis(Eigen::MatrixXd &z);
		std::vector<Eigen::MatrixXd> dpsis(Eigen::MatrixXd &z);
	};

}

#endif