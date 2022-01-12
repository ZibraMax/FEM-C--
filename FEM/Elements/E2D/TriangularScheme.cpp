#include "TriangularScheme.h"

namespace FEM
{
	TriangularScheme::TriangularScheme(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl)
		: Element2D(coords, gdl)
	{
		double A0 = 1.0 / 3.0;
		double A1 = 0.059715871789770;
		double A2 = 0.797426985353087;
		double B1 = 0.470142064105115;
		double B2 = 0.101286507323456;
		double W0 = 0.1125;
		double W1 = 0.066197076394253;
		double W2 = 0.062969590272413;

		Eigen::MatrixXd Z(1, 7);
		Z << A0, A1, B1, B1, B2, B2, A2;

		Eigen::MatrixXd N(1, 7);
		N << A0, B1, A1, B1, A2, B2, B2;

		this->z = Eigen::MatrixXd(2, 7);
		this->w = Eigen::VectorXd(7);
		this->domain = Eigen::MatrixXd(2, 3);

		this->z << Z, N;
		this->w << W0, W1, W1, W1, W2, W2, W2;
		this->domain << 0.0, 1.0, 0.0,
			0.0, 0.0, 1.0;
	}

} // namespace FEM
