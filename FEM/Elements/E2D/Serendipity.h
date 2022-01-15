#ifndef SERENDIPITY_H
#define SERENDIPITY_H
#include "RectangularScheme.h"
#include <vector>
#include <iostream>

namespace FEM
{
	class Serendipity : public RectangularScheme
	{
	public:
		Serendipity(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl);
		Eigen::MatrixXd psis(Eigen::MatrixXd &z);
		std::vector<Eigen::MatrixXd> dpsis(Eigen::MatrixXd &z);
	};

}
#endif