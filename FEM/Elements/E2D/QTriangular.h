#ifndef Q_TRIANGULAR_H
#define Q_TRIANGULAR_H

#include "TriangularScheme.h"
#include <vector>
#include <iostream>

namespace FEM
{
	class QTriangular : public TriangularScheme
	{
	public:
		QTriangular(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl);
		Eigen::MatrixXd psis(Eigen::MatrixXd &z);
		std::vector<Eigen::MatrixXd> dpsis(Eigen::MatrixXd &z);
	};

}

#endif