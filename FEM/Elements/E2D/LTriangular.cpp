#include "LTriangular.h"

namespace FEM
{
	LTriangular::LTriangular(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl)
		: TriangularScheme(coords, gdl)
	{
		//Definir bordes
	}

	Eigen::MatrixXd LTriangular::psis(Eigen::MatrixXd &z)
	{
		int n_z = z.row(0).size();
		Eigen::MatrixXd res(this->n, n_z);
		Eigen::ArrayXd _z = z.row(0).array();
		Eigen::ArrayXd _n = z.row(1).array();
		res << (1.0 - _z - _n).matrix().transpose(), _z.matrix().transpose(), _n.matrix().transpose();
		return res;
	}

	std::vector<Eigen::MatrixXd> LTriangular::dpsis(Eigen::MatrixXd &z)
	{
		std::vector<Eigen::MatrixXd> res;
		int n = z.row(0).size();
		for (int i = 0; i < n; i++)
		{
			Eigen::MatrixXd matrix(this->n, this->m);
			matrix << -1.0, -1.0, 1.0, 0.0, 0.0, 1.0;
			res.push_back(matrix);
		}

		return res;
	}

} // namespace FEM
