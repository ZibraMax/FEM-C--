#include "RectangularScheme.h"

namespace FEM
{
	RectangularScheme::RectangularScheme(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl, int n)
		: Element2D(coords, gdl)
	{

		std::vector<double> zz = Utils::darPuntos(n);
		std::vector<double> www = Utils::darPesos(n, zz);

		this->z = Eigen::MatrixXd::Zero(2, n * n);
		this->w = Eigen::VectorXd::Zero(n * n);
		this->domain = Eigen::MatrixXd(2, 4);

		for (int i = 0; i < n; i++)
		{
			for (int j = 0; j < n; j++)
			{
				this->z(0, i * n + j) = zz[i];
				this->z(1, i * n + j) = zz[j];
				this->w(i * n + j) = www[i] * www[j];
			}
		}
		this->domain << -1.0, 1.0, 1.0, -1.0,
			0.0, 0.0, 1.0, 1.0;
	}

} // namespace FEM
