#include "Quadrilateral.h"

namespace FEM
{
	Quadrilateral::Quadrilateral(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl)
		: RectangularScheme(coords, gdl, 3)
	{
		//Definir bordes
	}

	Eigen::MatrixXd Quadrilateral::psis(Eigen::MatrixXd &z)
	{
		int n_z = z.row(0).size();
		Eigen::MatrixXd res(this->n, n_z);
		Eigen::ArrayXd _z = z.row(0).array();
		Eigen::ArrayXd _n = z.row(1).array();

		res << (0.25 * (1.0 - _z) * (1.0 - _n)).matrix().transpose(),
			(0.25 * (1.0 + _z) * (1.0 - _n)).matrix().transpose(),
			(0.25 * (1.0 + _z) * (1.0 + _n)).matrix().transpose(),
			(0.25 * (1.0 - _z) * (1.0 + _n)).matrix().transpose();
		return res;
	}

	std::vector<Eigen::MatrixXd> Quadrilateral::dpsis(Eigen::MatrixXd &z)
	{
		std::vector<Eigen::MatrixXd> res;
		int n = z.row(0).size();
		for (int i = 0; i < n; i++)
		{
			Eigen::MatrixXd matrix(this->n, this->m);
			double _z = z(0, i);
			double _n = z(1, i);
			matrix << 0.25 * (_n - 1.0), 0.25 * (_z - 1.0),
				-0.25 * (_n - 1.0), -0.25 * (_z + 1.0),
				0.25 * (_n + 1.0), 0.25 * (1.0 + _z),
				-0.25 * (1.0 + _n), 0.25 * (1.0 - _z);
			res.push_back(matrix);
		}

		return res;
	}

} // namespace FEM
